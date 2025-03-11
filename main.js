const canvas = document.getElementById("renderCanvas");
if (!canvas) {
    console.error("Canvas introuvable !");
    throw new Error("Canvas manquant");
}
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Fond initial
    scene.clearColor = new BABYLON.Color4(0, 0, 0.1, 1);

    // Charger la serre
    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "serre.glb", scene).then((result) => {
        result.meshes.forEach((mesh) => {
            mesh.position = new BABYLON.Vector3(0, 0, 0);
            mesh.scaling = new BABYLON.Vector3(14, 14, 14);
            mesh.isPickable = false; // Désactiver la pickabilité de la serre
        });
        console.log("Serre chargée avec succès");
    }).catch((error) => {
        console.error("Erreur lors du chargement de serre.glb :", error);
    });

    // Sol
    const ground = BABYLON.MeshBuilder.CreateDisc("ground", { radius: 200, tessellation: 64 }, scene);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -0.1;
    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("/textures/grass.jpg", scene);
    groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;
    ground.isPickable = false; // Désactiver la pickabilité du sol

    // Fond étoilé initial avec PhotoDome
    let currentDome = new BABYLON.PhotoDome("starDome", "/textures/background.jpg", { resolution: 32, size: 1000 }, scene);
    currentDome.isPickable = false; // Désactiver la pickabilité du dôme

    // Définition des humeurs avec leurs backgrounds
    const moods = [
        { name: "Joie", sphere: null, position: new BABYLON.Vector3(-80, 5, 0), color: new BABYLON.Color3(1, 0.8, 0), background: "/textures/background.jpg" },
        { name: "Calme", sphere: null, position: new BABYLON.Vector3(0, 4, 0), color: new BABYLON.Color3(0, 0.5, 1), background: "/textures/background3.jpg" },
        { name: "Énergie", sphere: null, position: new BABYLON.Vector3(80, 4, 0), color: new BABYLON.Color3(1, 0, 0), background: "/textures/background4.jpg" },
        { name: "Triste", sphere: null, position: new BABYLON.Vector3(0, 4, 80), color: new BABYLON.Color3(0.5, 0.5, 0.8), background: "/textures/background2.jpg" },
    ];

    // Créer les sphères lumineuses
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 0.8;

    moods.forEach((mood) => {
        const sphere = BABYLON.MeshBuilder.CreateSphere(mood.name, { diameter: 8 }, scene);
        sphere.position = mood.position;
        sphere.material = new BABYLON.StandardMaterial(`${mood.name}Mat`, scene);
        sphere.material.emissiveColor = mood.color;
        sphere.material.specularColor = new BABYLON.Color3(1, 1, 1);
        sphere.metadata = { name: mood.name, background: mood.background };
        sphere.isPickable = true; // Seules les sphères sont cliquables
        mood.sphere = sphere;
    });

    // Particules étoiles extérieures
    const stars = new BABYLON.ParticleSystem("stars", 1000, scene);
    stars.emitter = new BABYLON.Vector3(0, 0, 0);
    stars.minEmitBox = new BABYLON.Vector3(-500, -500, -500);
    stars.maxEmitBox = new BABYLON.Vector3(500, 500, 500);
    stars.particleTexture = new BABYLON.Texture("https://www.babylonjs.com/assets/Flare.png", scene);
    stars.color1 = new BABYLON.Color4(1, 1, 1, 1);
    stars.color2 = new BABYLON.Color4(0.8, 0.8, 1, 0.8);
    stars.minSize = 0.1;
    stars.maxSize = 0.5;
    stars.emitRate = 200;
    stars.minLifeTime = 0.5;
    stars.maxLifeTime = 2.0;
    stars.start();

    // Particules scintillantes dans la verrière
    const particles = new BABYLON.ParticleSystem("sparkles", 500, scene);
    particles.emitter = new BABYLON.Vector3(0, 40, 0);
    particles.minEmitBox = new BABYLON.Vector3(-120, -10, -120);
    particles.maxEmitBox = new BABYLON.Vector3(120, 160, 120);
    particles.particleTexture = new BABYLON.Texture("https://www.babylonjs.com/assets/Flare.png", scene);
    particles.color1 = new BABYLON.Color4(1, 1, 1, 1);
    particles.color2 = new BABYLON.Color4(0.5, 0.5, 1, 1);
    particles.minSize = 0.05;
    particles.maxSize = 0.2;
    particles.emitRate = 100;
    particles.start();

    // Caméra
    const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 2, 280, new BABYLON.Vector3(0, 40, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 80;
    camera.upperRadiusLimit = 600;
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI / 2;

    // Lumière
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Interaction au clic uniquement sur les sphères
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
            const pickResult = pointerInfo.pickInfo;
            console.log("Clic détecté :", {
                hit: pickResult.hit,
                pickedMesh: pickResult.pickedMesh ? pickResult.pickedMesh.name : "aucun",
                hasMetadata: pickResult.pickedMesh && pickResult.pickedMesh.metadata ? true : false
            });

            if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.metadata) {
                const sphere = pickResult.pickedMesh;
                const newBackground = sphere.metadata.background;

                // Supprimer l’ancien PhotoDome
                if (currentDome) {
                    currentDome.dispose();
                }

                // Créer un nouveau PhotoDome avec le nouveau background
                currentDome = new BABYLON.PhotoDome("starDome", newBackground, { resolution: 32, size: 1000 }, scene);
                currentDome.isPickable = false; // Désactiver la pickabilité du nouveau dôme
                console.log(`Background changé pour : ${sphere.metadata.name} (${newBackground})`);
            } else {
                console.log("Clic hors sphère, background inchangé");
            }
        }
    });

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});