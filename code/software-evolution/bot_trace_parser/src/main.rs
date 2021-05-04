// Turn on clippy lints
#![warn(clippy::all)]
use chrono::{DateTime, Utc};
use crossbeam_channel::bounded;
use nannou::{daggy::petgraph::graph, prelude::*};
use nannou_osc as osc;
use std::{
    convert::TryInto,
    fs,
    path::{Path, PathBuf},
};
mod profile;
use profile::{GraphData, Profile, TraceData, TreeNode};
mod audio_interface;
mod coverage;
use audio_interface::*;
use coverage::*;
mod spawn_synthesis_nodes;
use spawn_synthesis_nodes::*;
mod draw_functions;
mod from_web_api;

fn main() {
    nannou::app(model).update(update).run();
}

enum ColorMode {
    Script,
    Profile,
    Selected,
}

enum DrawMode {
    Indentation(ProfileDrawMode),
    LineLength(ProfileDrawMode),
    GraphDepth(GraphDepthDrawMode),
    Coverage(CoverageDrawMode),
}

enum ProfileDrawMode {
    SingleFlower,
}

enum GraphDepthDrawMode {
    Vertical,
    Horizontal,
    Polar,
    PolarGrid,
}

enum CoverageDrawMode {
    HeatMap,
    Blob,
}

impl DrawMode {
    fn to_str(&self) -> &str {
        match self {
            DrawMode::Indentation(pdm) => match pdm {
                ProfileDrawMode::SingleFlower => "indentation - single flower",
            },
            DrawMode::LineLength(pdm) => match pdm {
                ProfileDrawMode::SingleFlower => "line length - single flower",
            },
            DrawMode::GraphDepth(gddm) => match gddm {
                GraphDepthDrawMode::Vertical => "graph depth - vertical",
                GraphDepthDrawMode::Horizontal => "graph depth - horizontal",
                GraphDepthDrawMode::Polar => "graph depth - polar",
                GraphDepthDrawMode::PolarGrid => "graph depth - polar grid",
            },
            DrawMode::Coverage(cdm) => match cdm {
                CoverageDrawMode::HeatMap => "coverage - heat map",
                CoverageDrawMode::Blob => "coverage - blob",
            },
        }
    }
}

/// For keeping track of frames when rendering
enum RenderState {
    NoRendering,
    RenderAllTraces { current_trace: usize },
}

pub struct Model {
    selected_page: usize,
    sites: Vec<String>,
    selected_profile: usize,
    trace_datas: Vec<TraceData>,
    deepest_tree_depth: u32,
    longest_tree: u32,
    deepest_indentation: u32,
    longest_indentation: u32,
    deepest_line_length: u32,
    longest_line_length: u32,
    longest_coverage_vector: usize,
    max_coverage_vector_count: i32,
    max_coverage_total_length: i64,
    index: usize,
    separation_ratio: f32,
    draw_mode: DrawMode,
    color_mode: ColorMode,
    sender: osc::Sender<osc::Connected>,
    audio_interface: audio_interface::AudioInterface,
    font: nannou::text::Font,
    render_state: RenderState,
    use_web_api: bool,
}

fn model(app: &App) -> Model {
    let _window = app
        .new_window()
        .view(view)
        .event(window_event)
        .size(1080, 1080)
        .build()
        .unwrap();

    // Set up osc sender
    let port = 57120;
    let target_addr = format!("{}:{}", "127.0.0.1", port);

    let sender = osc::sender()
        .expect("Could not bind to default socket")
        .connect(target_addr)
        .expect("Could not connect to socket at address");

    let mut audio_interface = AudioInterface::new();
    audio_interface.connect_to_system(2);

    audio_interface.send(EventMsg::AddSynthesisNode(Some(
        generate_wave_guide_synthesis_node(220., audio_interface.sample_rate as f32),
    )));
    audio_interface.send(EventMsg::AddSynthesisNode(Some(
        generate_wave_guide_synthesis_node(440., audio_interface.sample_rate as f32),
    )));
    audio_interface.send(EventMsg::AddSynthesisNode(Some(
        generate_wave_guide_synthesis_node(220. * 5. / 4., audio_interface.sample_rate as f32),
    )));
    audio_interface.send(EventMsg::AddSynthesisNode(Some(
        generate_wave_guide_synthesis_node(220. * 7. / 4., audio_interface.sample_rate as f32),
    )));

    let use_web_api = true;
    let sites = if use_web_api {
        from_web_api::get_all_sites().expect("Failed to get list of pages from Web API")
    } else {
        let list = vec![
            "bing",
            "duckduckgo",
            "google",
            "kiddle",
            "qwant",
            "spotify",
            "wikipedia",
            "yahoo",
        ];
        list.iter()
            .map(|s| String::from(*s))
            .collect::<Vec<String>>()
    };

    let font = nannou::text::font::from_file("/home/erik/.fonts/SpaceMono-Regular.ttf").unwrap();

    let mut model = Model {
        selected_page: 0,
        sites,
        trace_datas: vec![],
        deepest_tree_depth: 0,
        longest_tree: 0,
        deepest_indentation: 0,
        longest_indentation: 0,
        deepest_line_length: 0,
        longest_line_length: 0,
        longest_coverage_vector: 0,
        max_coverage_vector_count: 0,
        max_coverage_total_length: 0,
        index: 0,
        separation_ratio: 1.0,
        draw_mode: DrawMode::GraphDepth(GraphDepthDrawMode::Polar),
        color_mode: ColorMode::Profile,
        sender,
        selected_profile: 0,
        audio_interface,
        font,
        render_state: RenderState::NoRendering,
        use_web_api,
    };

    load_site(&mut model, app);
    model
}

fn load_site_from_disk(site: &str) -> Vec<TraceData> {
    let root_path = PathBuf::from("/home/erik/code/kth/web_evolution_2021-04/");
    let mut trace_datas = vec![];

    let mut page_folder = root_path.clone();
    page_folder.push(site);
    let trace_paths_in_folder = fs::read_dir(page_folder)
        .expect("Failed to open page folder")
        .filter(|r| r.is_ok()) // Get rid of Err variants for Result<DirEntry>
        .map(|r| r.unwrap().path())
        .filter(|r| r.is_dir()) // Only keep folders
        .collect::<Vec<_>>();
    for (i, p) in trace_paths_in_folder.iter().enumerate() {
        let mut folder_path = p.clone();
        folder_path.push("profile.json");
        let data = fs::read_to_string(&folder_path).unwrap();
        let profile: Profile = serde_json::from_str(&data).unwrap();
        let graph_data = profile.generate_graph_data();
        // Create TraceData
        let timestamp: String = if let Some(ts_osstr) = p.iter().last() {
            if let Some(ts) = ts_osstr.to_str() {
                ts.to_owned()
            } else {
                String::from("failed to process folder name")
            }
        } else {
            String::from("unknown timestamp")
        };
        let mut trace_data = TraceData::new(site.to_owned(), timestamp, graph_data);
        // Load indentation profile
        folder_path.pop();
        folder_path.push("indent_profile.csv");
        if let Ok(indentation_profile) = fs::read_to_string(&folder_path) {
            if let Err(_) = trace_data.add_indentation_profile(indentation_profile) {
                eprintln!("Failed to parse {:?}", folder_path);
            }
        }
        // Load line length profile
        folder_path.pop();
        folder_path.push("line_length_profile.csv");
        if let Ok(line_length_profile) = fs::read_to_string(&folder_path) {
            if let Err(_) = trace_data.add_line_length_profile(line_length_profile) {
                eprintln!("Failed to parse {:?}", folder_path);
            }
        }
        // Load coverage
        folder_path.pop();
        folder_path.push("coverage.json");
        let data = fs::read_to_string(&folder_path).unwrap();
        let coverage = Coverage::from_data(data);
        trace_data.coverage = Some(coverage);

        // Copy screenshots to new location
        folder_path.pop();
        folder_path.push("screenshots");
        // copy_screenshot(&folder_path, &app, pages[model.selected_page], i);

        trace_datas.push(trace_data);
    }
    trace_datas
}

fn load_site(model: &mut Model, _app: &App) {
    while model.selected_page < model.sites.len() {
        model.selected_page += model.sites.len()
    }
    while model.selected_page >= model.sites.len() {
        model.selected_page -= model.sites.len()
    }

    let trace_datas = if model.use_web_api {
        from_web_api::get_trace_data_from_site(&model.sites[model.selected_page])
    } else {
        load_site_from_disk(&model.sites[model.selected_page])
    };

    let mut deepest_tree_depth = 0;
    let mut longest_tree = 0;
    let mut deepest_indentation = 0;
    let mut longest_indentation = 0;
    let mut deepest_line_length = 0;
    let mut longest_line_length = 0;
    let mut longest_coverage_vector = 0;
    let mut max_coverage_vector_count = 0;
    let mut max_coverage_total_length = 0;
    for td in &trace_datas {
        let gd = &td.graph_data;
        if gd.depth_tree.len() > longest_tree {
            longest_tree = gd.depth_tree.len();
        }
        for node in &gd.depth_tree {
            if node.depth > deepest_tree_depth {
                deepest_tree_depth = node.depth;
            }
        }
        if let Some(indentation_profile) = &td.indentation_profile {
            if indentation_profile.len() > longest_indentation {
                longest_indentation = indentation_profile.len();
            }
            for v in indentation_profile {
                if *v > deepest_indentation {
                    deepest_indentation = *v;
                }
            }
        }
        if let Some(line_length_profile) = &td.line_length_profile {
            if line_length_profile.len() > longest_line_length {
                longest_line_length = line_length_profile.len();
            }
            for v in line_length_profile {
                if *v > deepest_line_length {
                    deepest_line_length = *v;
                }
            }
        }
        if let Some(coverage) = &td.coverage {
            if coverage.vector.len() > longest_coverage_vector {
                longest_coverage_vector = coverage.vector.len();
            }
            let total_length = coverage.total_length;
            if total_length > max_coverage_total_length {
                max_coverage_total_length = total_length;
            }
            for pair in &coverage.vector {
                if pair.1 > max_coverage_vector_count {
                    max_coverage_vector_count = pair.1;
                }
            }
        }
    }

    println!(
        "deepest_indentation: {}, longest_indentation: {}",
        deepest_indentation, longest_indentation
    );

    model.trace_datas = trace_datas;
    model.longest_tree = longest_tree.try_into().unwrap();
    model.deepest_tree_depth = deepest_tree_depth.try_into().unwrap();
    model.longest_indentation = longest_indentation.try_into().unwrap();
    model.deepest_indentation = deepest_indentation;
    model.longest_line_length = longest_line_length.try_into().unwrap();
    model.deepest_line_length = deepest_line_length;
    model.longest_coverage_vector = longest_coverage_vector;
    model.max_coverage_vector_count = max_coverage_vector_count;
    model.max_coverage_total_length = max_coverage_total_length;
}

fn update(app: &App, model: &mut Model, _update: Update) {
    model.index += 10;
    match &mut model.render_state {
        RenderState::RenderAllTraces { current_trace } => {
            if *current_trace > 0 {
                // We must wait until the first trace has been drawn before saving it.
                // Capture the frame!
                let name = &model.trace_datas[model.selected_profile].name;
                let timestamp = &model.trace_datas[model.selected_profile].timestamp;
                let file_path =
                    rendering_frame_path(app, &model.draw_mode, name, *current_trace - 1);
                app.main_window().capture_frame(file_path);
            }
            // Are we done?
            if *current_trace == model.trace_datas.len() {
                // All traces have been rendered
                model.render_state = RenderState::NoRendering;
                model.selected_profile = 0;
            } else {
                // Set the next trace up for rendering
                model.selected_profile = *current_trace;
                *current_trace += 1;
            }
        }
        RenderState::NoRendering => (),
    }
}

fn view(app: &App, model: &Model, frame: Frame) {
    // Prepare to draw.
    let draw = app.draw();

    // Clear the background to purple.
    draw.background().color(hsl(0.6, 0.1, 0.02));

    let win = app.window_rect();

    let mut name = &model.trace_datas[0].name;
    let mut timestamp = "";
    let mut color_type = match model.color_mode {
        ColorMode::Script => "script colour",
        ColorMode::Profile => "profile index colour",
        ColorMode::Selected => "selection colour",
    };

    let visualisation_type = model.draw_mode.to_str();
    match &model.draw_mode {
        DrawMode::GraphDepth(gddm) => match gddm {
            GraphDepthDrawMode::Horizontal => {
                draw_functions::draw_horizontal_graph_depth(&draw, model, &win);
            }
            GraphDepthDrawMode::Vertical => {
                draw_functions::draw_vertical_graph_depth(&draw, model, &win);
            }
            GraphDepthDrawMode::Polar => {
                draw_functions::draw_polar_depth_graph(&draw, model, &win);
                timestamp = &model.trace_datas[model.selected_profile].timestamp;
            }
            GraphDepthDrawMode::PolarGrid => {
                draw_functions::draw_flower_grid_graph_depth(&draw, model, &win);
            }
        },
        DrawMode::Indentation(pdm) => match pdm {
            ProfileDrawMode::SingleFlower => {
                draw_functions::draw_single_flower_indentation(&draw, model, &win);
                timestamp = &model.trace_datas[model.selected_profile].timestamp;
            }
        },
        DrawMode::LineLength(pdm) => match pdm {
            ProfileDrawMode::SingleFlower => {
                draw_functions::draw_single_flower_line_length(&draw, model, &win);
                timestamp = &model.trace_datas[model.selected_profile].timestamp;
            }
        },
        DrawMode::Coverage(cdm) => match cdm {
            CoverageDrawMode::HeatMap => {
                draw_functions::draw_coverage_heat_map(&draw, model, &win);
                timestamp = &model.trace_datas[model.selected_profile].timestamp;
            }
            CoverageDrawMode::Blob => {
                draw_functions::draw_coverage_blob(&draw, model, &win);
                timestamp = &model.trace_datas[model.selected_profile].timestamp;
            }
        },
    };

    let full_text = format!(
        "{}\n{}\n\n{}\n{}",
        name, timestamp, visualisation_type, color_type
    );
    draw.text(&full_text)
        .font_size(16)
        .align_text_bottom()
        .right_justify()
        // .x_y(0.0, 0.0)
        .wh(win.clone().pad(20.).wh())
        .font(model.font.clone())
        // .x_y(win.right()-130.0, win.bottom() + 10.0)
        .color(LIGHTGREY);

    // Write to the window frame.
    draw.to_frame(app, &frame).unwrap();
}

fn window_event(app: &App, model: &mut Model, event: WindowEvent) {
    match event {
        KeyPressed(key) => match key {
            Key::A => match &mut model.draw_mode {
                DrawMode::GraphDepth(ref mut gddm) => match gddm {
                    GraphDepthDrawMode::Horizontal => *gddm = GraphDepthDrawMode::Vertical,
                    GraphDepthDrawMode::Vertical => *gddm = GraphDepthDrawMode::Polar,
                    GraphDepthDrawMode::Polar => *gddm = GraphDepthDrawMode::PolarGrid,
                    GraphDepthDrawMode::PolarGrid => *gddm = GraphDepthDrawMode::Horizontal,
                },
                DrawMode::Indentation(ref mut pdm) => match pdm {
                    ProfileDrawMode::SingleFlower => (),
                },
                DrawMode::LineLength(ref mut pdm) => match pdm {
                    ProfileDrawMode::SingleFlower => (),
                },
                DrawMode::Coverage(ref mut cdm) => match cdm {
                    CoverageDrawMode::HeatMap => *cdm = CoverageDrawMode::Blob,
                    CoverageDrawMode::Blob => *cdm = CoverageDrawMode::HeatMap,
                },
            },
            Key::D => match &mut model.draw_mode {
                DrawMode::GraphDepth(ref mut gddm) => match gddm {
                    GraphDepthDrawMode::Horizontal => *gddm = GraphDepthDrawMode::PolarGrid,
                    GraphDepthDrawMode::Vertical => *gddm = GraphDepthDrawMode::Horizontal,
                    GraphDepthDrawMode::Polar => *gddm = GraphDepthDrawMode::Vertical,
                    GraphDepthDrawMode::PolarGrid => *gddm = GraphDepthDrawMode::Polar,
                },
                DrawMode::Indentation(ref mut pdm) => match pdm {
                    ProfileDrawMode::SingleFlower => (),
                },
                DrawMode::LineLength(ref mut pdm) => match pdm {
                    ProfileDrawMode::SingleFlower => (),
                },
                DrawMode::Coverage(ref mut cdm) => match cdm {
                    CoverageDrawMode::HeatMap => *cdm = CoverageDrawMode::Blob,
                    CoverageDrawMode::Blob => *cdm = CoverageDrawMode::HeatMap,
                },
            },
            Key::W => {
                model.draw_mode = match &model.draw_mode {
                    DrawMode::GraphDepth(_gddm) => {
                        DrawMode::Indentation(ProfileDrawMode::SingleFlower)
                    }
                    DrawMode::Indentation(_pdm) => {
                        DrawMode::LineLength(ProfileDrawMode::SingleFlower)
                    }
                    DrawMode::LineLength(_pdm) => DrawMode::Coverage(CoverageDrawMode::HeatMap),
                    DrawMode::Coverage(_cdm) => DrawMode::GraphDepth(GraphDepthDrawMode::Polar),
                }
            }
            Key::S => {
                model.draw_mode = match &model.draw_mode {
                    DrawMode::GraphDepth(_gddm) => DrawMode::Coverage(CoverageDrawMode::HeatMap),
                    DrawMode::Indentation(_pdm) => DrawMode::GraphDepth(GraphDepthDrawMode::Polar),
                    DrawMode::LineLength(_pdm) => {
                        DrawMode::Indentation(ProfileDrawMode::SingleFlower)
                    }
                    DrawMode::Coverage(_cdm) => DrawMode::LineLength(ProfileDrawMode::SingleFlower),
                }
            }
            Key::Up => {
                model.selected_page += 1;
                load_site(model, app);
                model.selected_profile = 0;
            }
            Key::Down => {
                model.selected_page -= 1;
                load_site(model, app);
                model.selected_profile = 0;
            }
            Key::Left => {
                if model.selected_profile > 0 {
                    model.selected_profile -= 1;
                } else {
                    model.selected_profile = model.trace_datas.len() - 1;
                }
            }
            Key::Right => {
                model.selected_profile = (model.selected_profile + 1) % model.trace_datas.len();
            }
            Key::C => {
                model.color_mode = match model.color_mode {
                    ColorMode::Script => ColorMode::Profile,
                    ColorMode::Profile => ColorMode::Selected,
                    ColorMode::Selected => ColorMode::Script,
                }
            }
            Key::S => {
                // Capture the frame!
                let file_path = captured_frame_path(app);
                app.main_window().capture_frame(file_path);
            }
            Key::T => {
                // Send graph data via osc
                model.trace_datas[model.selected_profile]
                    .graph_data
                    .send_script_data_osc(&model.sender);
            }
            Key::R => {
                model.render_state = RenderState::RenderAllTraces { current_trace: 0 };
            }
            Key::Space => {
                // model.audio_interface.send(EventMsg::AddSynthesisNode(Some(
                //     synthesis_node_from_graph_data(
                //         &model.graph_datas[model.selected_profile],
                //         model.audio_interface.sample_rate as f32,
                //     ),
                // )));
                synthesize_call_graph(
                    &model.trace_datas[model.selected_profile].graph_data,
                    5.0,
                    model.audio_interface.sample_rate as f32,
                    &mut model.audio_interface,
                )
            }
            _ => (),
        },
        KeyReleased(_key) => {}
        MouseMoved(pos) => {
            model.separation_ratio = (pos.x + app.window_rect().w() / 2.0) / app.window_rect().w();
        }
        MousePressed(button) => match button {
            MouseButton::Left => {
                model.index = 0;
            }
            MouseButton::Right => {
                model.index = 99999;
            }
            _ => (),
        },
        MouseReleased(_button) => {}
        MouseEntered => {}
        MouseExited => {}
        MouseWheel(_amount, _phase) => {}
        Moved(_pos) => {}
        Resized(_size) => {}
        Touch(_touch) => {}
        TouchPressure(_pressure) => {}
        HoveredFile(_path) => {}
        DroppedFile(_path) => {}
        HoveredFileCancelled => {}
        Focused => {}
        Unfocused => {}
        Closed => {}
    }
}

fn captured_frame_path(app: &App) -> std::path::PathBuf {
    // Create a path that we want to save this frame to.
    let now: DateTime<Utc> = Utc::now();
    app.project_path()
        .expect("failed to locate `project_path`")
        // Capture all frames to a directory called `/<path_to_nannou>/nannou/simple_capture`.
        .join("screencaps")
        // Name each file after the number of the frame.
        .join(format!("{}", now.to_rfc3339()))
        // The extension will be PNG. We also support tiff, bmp, gif, jpeg, webp and some others.
        .with_extension("png")
}

fn rendering_frame_path(
    app: &App,
    draw_mode: &DrawMode,
    name: &str,
    frame_number: usize,
) -> std::path::PathBuf {
    // Create a path that we want to save this frame to.
    let now: DateTime<Utc> = Utc::now();
    app.project_path()
        .expect("failed to locate `project_path`")
        // Capture all frames to a directory called `/<path_to_nannou>/nannou/simple_capture`.
        .join("renders")
        .join(name)
        .join(draw_mode.to_str())
        // Name each file after the number of the frame.
        // .join(format!("{}", now.to_rfc3339()))
        // Name each file after its timestamp
        .join(format!("{:04}", frame_number))
        // The extension will be PNG. We also support tiff, bmp, gif, jpeg, webp and some others.
        .with_extension("png")
}

fn screenshot_collection_path(app: &App, name: &str, frame_number: usize) -> std::path::PathBuf {
    app.project_path()
        .expect("failed to locate `project_path`")
        .join("screenshot_collection")
        .join(name)
        .join(format!("{:04}", frame_number))
        .with_extension("jpg")
}

fn copy_screenshot(folder_path: &PathBuf, app: &App, name: &str, frame_number: usize) {
    let screenshot_paths_in_folder = fs::read_dir(folder_path)
        .expect("Failed to open screenshot folder")
        .filter(|r| r.is_ok()) // Get rid of Err variants for Result<DirEntry>
        .map(|r| r.unwrap().path())
        .filter(|r| r.is_file())
        .filter(|r| {
            if let Some(ext) = r.extension() {
                ext == "jpg"
            } else {
                false
            }
        })
        .collect::<Vec<_>>();

    let mut last_screenshot_path = PathBuf::new();
    let mut highest_screenshot_timestamp = 0;
    for p in screenshot_paths_in_folder {
        let timestamp: u64 = p
            .file_stem()
            .unwrap()
            .to_string_lossy()
            .parse::<u64>()
            .unwrap();
        if timestamp > highest_screenshot_timestamp {
            last_screenshot_path = p;
            highest_screenshot_timestamp = timestamp;
        }
    }
    let new_path = screenshot_collection_path(&app, name, frame_number);
    println!(
        "old: {:?}: {:?}, new: {:?}",
        last_screenshot_path,
        last_screenshot_path.is_file(),
        new_path
    );
    // Create the parent dir of the new file if it doesn't exist
    let mut new_path_parent = new_path.clone();
    new_path_parent.pop();
    fs::create_dir_all(new_path_parent);
    // Copy the file
    match std::fs::copy(last_screenshot_path, new_path) {
        Ok(_) => (),
        Err(e) => eprintln!("{}", e),
    }
}
