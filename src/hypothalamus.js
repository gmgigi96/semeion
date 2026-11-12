// Modello ingrandito dell'ipotalamo: i nuclei dei due lati attorno al terzo
// ventricolo, con ipofisi, chiasma ottico, fornice e corpi mammillari.
//
// Coordinate del modello: x laterale, y craniale, z anteriore.
import { AnatomyModel } from './model.js';
import { V, taperTube, ellipsoid, both } from './geo.js';

const P = (list) => list.map((p) => V(...p));
const tube = (pts, r, opts) => taperTube(P(pts), r, opts);

export class Hypothalamus extends AnatomyModel {
  constructor() {
    super({ tilt: -0.55 });
    this.addStand({ radius: 0.2, z: 0.02, rod: [0, 0.02, 0.2, -0.12] });
    this.#context();
    this.#nuclei();
    this.#pathways();
  }

  #context() {
    const WHITE = 0xf1ead8;
    this.addPart('v3', 'terzo ventricolo', 0x6fbfdc, [ellipsoid([0, 0.45, 0], [0.006, 0.22, 0.31])], { ghost: true, opacity: 0.2 });
    this.addPart('thalamus', 'talamo', 0xc9a27a, both(ellipsoid([0.1, 0.66, -0.1], [0.085, 0.07, 0.2])), { opacity: 0.45 });
    this.addPart('commissure', 'commessura anteriore', WHITE, [tube([[-0.16, 0.5, 0.29], [0, 0.535, 0.31], [0.16, 0.5, 0.29]], 0.018)]);
    this.addPart('lamina', 'lamina terminale', 0xd9d2bf, [tube([[0, 0.515, 0.31], [0, 0.4, 0.33], [0, 0.285, 0.29]], 0.012, { flat: { x: 2.2 } })], { opacity: 0.7 });
    this.addPart('chiasm', 'chiasma ottico', WHITE, [
      tube([[-0.19, 0.25, 0.4], [-0.06, 0.24, 0.27], [0.06, 0.235, 0.15], [0.17, 0.25, 0.04]], 0.022, { flat: { y: 0.6 } }),
      tube([[0.19, 0.25, 0.4], [0.06, 0.24, 0.27], [-0.06, 0.235, 0.15], [-0.17, 0.25, 0.04]], 0.022, { flat: { y: 0.6 } }),
    ]);
    this.addPart('fornix', 'fornice postcommessurale', WHITE,
      both(tube([[0.045, 0.62, 0.24], [0.05, 0.5, 0.2], [0.06, 0.37, 0.0], [0.04, 0.27, -0.22]], 0.014, { caps: false })));
    this.addPart('mtt', 'fascio mammillotalamico', WHITE,
      both(tube([[0.04, 0.27, -0.25], [0.06, 0.42, -0.2], [0.075, 0.6, -0.1]], 0.012, { caps: false })));
    this.addPart('mammillary', 'corpo mammillare', 0xd9c06a, both(ellipsoid([0.035, 0.24, -0.26], [0.035, 0.035, 0.038])));
    this.addPart('stalk', 'peduncolo ipofisario', 0xe7c9b9, [tube([[0, 0.215, 0.05], [0, 0.16, 0.065], [0, 0.1, 0.07]], [0.022, 0.014, 0.016], { caps: false })]);
    this.addPart('adeno', 'adenoipofisi', 0xd9765f, [ellipsoid([0, 0.055, 0.105], [0.055, 0.042, 0.04])]);
    this.addPart('neuro', 'neuroipofisi', 0xe9c9a0, [ellipsoid([0, 0.058, 0.04], [0.04, 0.036, 0.032])]);
    this.addPart('eminence', 'eminenza mediana', 0xc06a8a, [ellipsoid([0, 0.222, 0.045], [0.034, 0.013, 0.045])]);
  }

  #nuclei() {
    const e = (c, r, rot) => both(ellipsoid(c, r, rot));
    // regione preottica
    this.addPart('preopticM', 'nucleo preottico mediale', 0xe0a23c, e([0.045, 0.4, 0.265], [0.03, 0.05, 0.03]));
    this.addPart('preopticL', 'nucleo preottico laterale', 0xc98a2b, e([0.115, 0.39, 0.255], [0.028, 0.045, 0.03]));
    // regione sopraottica
    this.addPart('suprachiasmatic', 'nucleo soprachiasmatico', 0xf2d13c, e([0.019, 0.285, 0.195], [0.015, 0.015, 0.022]));
    this.addPart('supraoptic', 'nucleo sopraottico', 0x3f7fc4, e([0.085, 0.295, 0.17], [0.024, 0.017, 0.04], [0, -0.5, 0]));
    this.addPart('paraventricular', 'nucleo paraventricolare', 0x2f5fa8, e([0.03, 0.49, 0.15], [0.02, 0.042, 0.038]));
    this.addPart('anterior', 'nucleo ipotalamico anteriore', 0xd9652b, e([0.047, 0.385, 0.165], [0.03, 0.042, 0.045]));
    // zona periventricolare
    this.addPart('periventricular', 'nucleo periventricolare', 0x8fb7c9, e([0.014, 0.39, 0.07], [0.006, 0.1, 0.14]));
    // regione tuberale
    this.addPart('arcuate', 'nucleo arcuato', 0xc06a8a, e([0.018, 0.258, 0.04], [0.015, 0.015, 0.04]));
    this.addPart('dorsomedial', 'nucleo dorsomediale', 0x5aa35a, e([0.047, 0.445, 0.02], [0.03, 0.032, 0.055]));
    this.addPart('ventromedial', 'nucleo ventromediale', 0x2f8a4f, e([0.047, 0.335, 0.02], [0.033, 0.042, 0.058]));
    // regione mammillare
    this.addPart('posterior', 'nucleo ipotalamico posteriore', 0x8e5bb5, e([0.047, 0.41, -0.15], [0.033, 0.048, 0.055]));
    this.addPart('tuberomammillary', 'nucleo tubero-mammillare', 0xb78ad6, e([0.08, 0.29, -0.16], [0.022, 0.017, 0.034]));
    // zona laterale
    this.addPart('lateral', 'nucleo ipotalamico laterale', 0xc9485b, e([0.125, 0.37, -0.01], [0.028, 0.075, 0.2]), { opacity: 0.8 });
    this.addPart('mfb', 'fascio mediale del telencefalo', 0xf1ead8,
      both(tube([[0.16, 0.42, 0.33], [0.158, 0.4, 0.1], [0.158, 0.38, -0.15], [0.15, 0.36, -0.34]], 0.012, { caps: false })));
  }

  // Blu: neurosecrezione verso l'ipofisi; verde: eccitatoria; rosso: inibitoria.
  #pathways() {
    const HORM = 0x2f6fe0, GLU = 0x1f9d57, GABA = 0xd43d3d;
    this.addLink('pvn-neuro', P([[0.03, 0.46, 0.15], [0.03, 0.3, 0.1], [0.008, 0.2, 0.055], [0.004, 0.09, 0.05]]), { color: HORM });
    this.addLink('son-neuro', P([[0.08, 0.29, 0.16], [0.04, 0.24, 0.08], [0.01, 0.19, 0.06], [0.008, 0.09, 0.045]]), { color: HORM });
    this.addLink('arc-em', P([[0.018, 0.255, 0.03], [0.014, 0.238, 0.04], [0.008, 0.228, 0.05]]), { color: HORM });
    this.addLink('pev-em', P([[0.016, 0.33, 0.07], [0.02, 0.27, 0.075], [0.012, 0.232, 0.06]]), { color: HORM });
    this.addLink('portal', P([[0.0, 0.215, 0.06], [0.012, 0.16, 0.085], [0.006, 0.095, 0.1]]), { color: 0xc23b3b });
    this.addLink('retina-scn', P([[0.16, 0.25, 0.38], [0.07, 0.25, 0.28], [0.022, 0.275, 0.215]]), { color: GLU });
    this.addLink('scn-pvn', P([[0.02, 0.3, 0.19], [0.035, 0.39, 0.2], [0.032, 0.455, 0.165]]), { color: GLU });
    this.addLink('vlpo-tmn', P([[0.115, 0.36, 0.24], [0.17, 0.3, 0.05], [0.1, 0.28, -0.14]]), { color: GABA, inhibit: true });
    this.addLink('vlpo-orx', P([[0.125, 0.4, 0.24], [0.19, 0.44, 0.08], [0.15, 0.41, -0.1]]), { color: GABA, inhibit: true });
  }
}
