import * as global from './globals.js'
import * as tone_init from './tone_init.js';
import * as THREE from 'three';
import * as Tone from 'tone';
import * as graphics from './graphics.js';

class Motif {
    pitches;
    // Duration is the number of 16th notes the pitch spans
    durations;
    attacks;
    octave;
    pitchSet;
    pitchOffset;
    startDurOffset;
    schedulingIds;
    constructor() {
        this.pitchSet = global.sound.pitchSets[0];
        this.pitches = [];
        this.durations = [];
        this.attacks = [];
        this.noises = [];
        this.schedulingIds = [];
        this.octave = 0;
        this.pitchOffset = 0;
        this.startDurOffset = 0;
    }
    schedulePlayback(synth, noiseSynth, transport, material, color) {
        tone_init.clearIdsFromTransport(this.schedulingIds);
        this.schedulingIds = [];
        let totalDur = this.startDurOffset;
        // console.log("pitchlen: " + this.pitches.length + " durlen: " + this.durations.length);
        // console.log("durations: " + this.durations);
        // console.log("pitches: " + this.pitches);
        // console.log("noises: " + this.noises);
        for (let i in this.pitches) {
            // Schedule the note to be played
            let pitch = Tone.Frequency.mtof(this.pitches[i] + this.pitchOffset);
            let dur = "16n";
            // if(this.durations[i] > 4) {
            //     dur = "4n";
            // } else if(this.durations[i] > 2) {
            //     dur = "8n";
            // }
            let atk = this.attacks[i];
            let schedTime = dur16ToTransport(totalDur);
            let schedSynth = synth;
            let noisePlayback = false;
            if(this.noises[i]) {
                schedSynth = noiseSynth;
                // noisePlayback = true;
                pitch = Tone.Frequency.mtof((this.pitches[i] + this.pitchOffset) % 12 + 12);
            }
            let id = transport.schedule(function (time) {
                // console.log("pitch: " + pitch + " dur: " + dur + " time: " + time);
                schedSynth.envelope.attack = atk;
                if(noisePlayback) {
                    schedSynth.triggerAttackRelease(
                        "16n",//dur16ToTransport(dur/2),
                        time
                    );
                } else {
                    schedSynth.triggerAttackRelease(
                        pitch,
                        dur,//dur16ToTransport(dur/2),
                        time
                    );
                }
                
                material.color.copy(color);
                // material.color.setScalar(1.0);
            }, schedTime);
            // For later removing the event from scheduling
            this.schedulingIds.push(id);
            // Add the scheduling time so the next note is scheduled after this one.
            totalDur += this.durations[i];
        }
    }
    addDur(v) {
        this.pitches.push(global.sound.pitchSet[5]);
        // this.pitches.push(110);
        this.durations.push((v * 5) % 16 + 1);
        this.attacks.push(0.001);
        this.noises.push(true);
    }
    changePitch(i, newPitchIndex) {
        let index = Math.floor(i) % (this.pitches.length);
        this.pitches[index] = this.pitchSet[newPitchIndex % this.pitchSet.length];
        this.attacks[index] = 0.01;
        this.noises[index] = false;
    }
    addPitch(i) {
        this.pitches.push( this.pitchSet[i % this.pitchSet.length]);
        this.durations.push(2);
        this.attacks.push(0.01);
    }
    changeDur(i, newDur) {
        let index = Math.floor(i) % (this.durations.length);
        this.durations[index] = newDur;
    }
    clear() {
        this.pitches = [];
        this.durations = [];
        this.attacks = [];
        this.noises = [];
        this.octave = 0;
        this.pitchOffset = 0;
        this.startDurOffset = 0;
    }
}

/// Converts a duration based on the number of 16th notes to the Tone.Transport format "bar:quarter:sixteenth"
/// https://github.com/Tonejs/Tone.js/wiki/Time
function dur16ToTransport(dur) {
    const quarterNotesPerBar = 4;
    let sixteenths = dur % 4;
    let quarters = ((dur - sixteenths) / 4) % quarterNotesPerBar;
    let bars = (((dur - sixteenths) / 4) - quarters) / quarterNotesPerBar;
    return "" + bars + ":" + quarters + ":" + sixteenths;
}

function amp2db(amp) {
    20 * log10(amp);
}

class Fingerprint {
    motif; // a Motif
    position; // a THREE.Vector3
    material;
    geometry;
    mesh; // the 3D mesh that represents this
    synth; // the synth playing this fingerprint's motif
    noiseSynth;
    numParametersUsed;
    rawFingerprint;
    fingerprintSum;
    color;
    constructor(fingerprint, x, y, z) {
        const vs = fingerprint.split(",");
        this.rawFingerprint = vs.map(el => Number(el));
        this.fingerprintSum = this.rawFingerprint.reduce((prev, curr) => prev + curr, 0);
        this.color = new THREE.Color();
        this.color.setHSL((this.fingerprintSum % 1000)/1000, 0.6, 0.55);
        this.position = new THREE.Vector3(x, y, -z);
        this.material = new THREE.MeshStandardMaterial({ color: 0x00cccc })
        this.geometry = new THREE.TetrahedronGeometry(5, vs[0]);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;
        graphics.scene.add(this.mesh);
        this.motif = new Motif();
        this.numParametersUsed = 24;
        this.synth = tone_init.newSynth();
        this.noiseSynth = tone_init.newNoiseSynth();
        graphics.objects.push(this.mesh);
        this.updateMotif();
    }
    updateMotif() {
        this.motif.clear();
        this.motif.startDurOffset = (this.fingerprintSum) % 32;
        // For every 300 points two fingerprints differ they will be separated by a 5th
        // this.motif.pitchOffset = (Math.floor(this.fingerprintSum/300) * 7) % 12;
        // Choose a pitch set based on the fingerprint sum
        this.motif.pitchSet = global.sound.pitchSets[Math.floor(this.fingerprintSum/300) % global.sound.pitchSets.length];
        for (let i = 0; i < this.rawFingerprint.length && i < this.numParametersUsed; i++) {
            let v = global.data.headers[i] + "_" + this.rawFingerprint[i];
            // switch(i%2) {
            //     case 0:
            //         motif.addPitch(vs[i]);
            //         break;
            //     case 1:
            //         motif.changeDur(i/2, vs[i]%6 + 1);
            //         break;

            // }
            if (i == 0) {
                this.motif.octave = ((this.rawFingerprint[i]) % 3) - 1;
            } else if (i == 2) {
                this.synth.envelope.attack = Math.max(Math.min(0.0001 * this.rawFingerprint[i], 0.2), 0.001);
                // this.motif.pitchOffset = ((this.rawFingerprint[i] - 6) * 2) % 12;
                
                
            } else if (i == 1) { // headers[1] == "dnt", do not track, 0 or 1
                // this.motif.startDurOffset = (this.rawFingerprint[i] * 6) % 32;
                if(this.rawFingerprint[i] == 1) {
                    this.synth.envelope.decay = 0.5;
                }
            } else if (i == 3) {
                this.synth.oscillator.type = global.sound.oscillators[this.rawFingerprint[i] % global.sound.oscillators.length];
            } else if (i - 4 < Math.floor((global.data.headers.length - 4) / 2)) {
                this.motif.addDur(this.rawFingerprint[i]);
            } else {
                this.motif.changePitch(i - Math.floor((global.data.headers.length - 4) / 2) - 4, this.rawFingerprint[i]);
            }
        }
        this.motif.schedulePlayback(this.synth, this.noiseSynth, tone_init.getTransport(), this.material, this.color);
    }
    clearFromTransport() {
        tone_init.clearIdsFromTransport(this.motif.schedulingIds);
        this.motif.schedulingIds = [];
    }
    setAmp(amp) {
        this.synth.volume.value = amp2db(amp);
        this.noiseSynth.volume.value = amp2db(amp);
    }
    setDb(db) {
        this.synth.volume.value = db;
        this.noiseSynth.volume.value = db * 1.3;
    }
    updateDistanceSquared(distance2) {
        this.setDb(distance2 * -0.05 - 10);
        if (distance2 < 100) {
            this.material.transparent = true;
            this.material.opacity = distance2 / 100;
        }
        this.synth.harmonicity.value = Math.floor(Math.max(12 - (distance2 / 100), 1.0));
        this.synth.envelope.release = Math.max(0.5 - distance2 / 500, 0.002);
        let numParameters = 24 - ((distance2 - 150) / 30);
        if (numParameters != this.numParameters) {
            this.numParametersUsed = numParameters;
            this.updateMotif();
        }

        this.material.color.multiplyScalar(0.9);
    }
}

function getRandomFingerPrint() {
    return global.data.rawFingerprints[Math.floor(global.data.rawFingerprints.length * Math.random())];
}

function renderFingerPrint() {
    if (global.data.rawFingerprints.length == 0) {
      return;
    }
    const p = [];
    let size = 140;
    let fingerprint = new Fingerprint(getRandomFingerPrint(), Math.random() * size - (size/2), Math.random() * size - (size/2), Math.random() * size - (size/2));
    global.data.fingerprints.push(fingerprint);
}

export { Motif, Fingerprint, renderFingerPrint }