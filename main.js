const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Fond de ciel étoilé
    scene.clearColor = new BABYLON.Color4(0, 0, 0.1, 1);

    BABYLON.SceneLoader.ImportMeshAsync("", "objs/", "serre.glb", scene).then(function (result) {
        // On parcourt tous les meshes de la serre et on les redimensionne
        result.meshes.forEach((mesh) => {
            // Position de base pour la serre
            mesh.position = new BABYLON.Vector3(0, 0, 0);
            // Redimensionner la serre
            mesh.scaling = new BABYLON.Vector3(14, 14, 14);  
        });
    });
    

    // Créer le sol de la verrière
    const ground = BABYLON.MeshBuilder.CreateDisc("ground", {
        radius: 200,
        tessellation: 64
    }, scene);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -0.1;

    // Matériau du sol avec une texture locale
    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    const texture = new BABYLON.Texture("/textures/grass.jpg", scene);
    groundMaterial.diffuseTexture = texture;
    groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;

    // Fond étoilé extérieur
    const starDome = new BABYLON.PhotoDome(
        "starDome",
        "/textures/background.jpg",
        { resolution: 32, size: 1000 },
        scene
    );

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

    // Sphère Joie (jaune)
    const joy = BABYLON.MeshBuilder.CreateSphere("joy", { diameter: 10 }, scene);
    joy.position = new BABYLON.Vector3(-80, 5, 0);
    joy.material = new BABYLON.StandardMaterial("joyMat", scene);
    joy.material.emissiveColor = new BABYLON.Color3(1, 0.8, 0);
    joy.material.specularColor = new BABYLON.Color3(1, 1, 1);

    // Sphère Calme (bleu)
    const calm = BABYLON.MeshBuilder.CreateSphere("calm", { diameter: 8 }, scene);
    calm.position = new BABYLON.Vector3(0, 4, 0);
    calm.material = new BABYLON.StandardMaterial("calmMat", scene);
    calm.material.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
    calm.material.alpha = 0.9;

    // Sphère Énergie (rouge)
    const energy = BABYLON.MeshBuilder.CreateSphere("energy", { diameter: 8 }, scene);
    energy.position = new BABYLON.Vector3(80, 4, 0);
    energy.material = new BABYLON.StandardMaterial("energyMat", scene);
    energy.material.emissiveColor = new BABYLON.Color3(1, 0, 0);

    // Effet de lueur
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 0.8;

    // Particules scintillantes dans la verrière
    const particles = new BABYLON.ParticleSystem("sparkles", 500, scene);
    particles.emitter = new BABYLON.Vector3(0, 40, 0);
    particles.minEmitBox = new BABYLON.Vector3(-120, -10, -120);
    particles.maxEmitBox = new BABYLON.Vector3(120, 160, 120); // Ajustez les valeurs pour éviter les particules de débordement
    particles.particleTexture = new BABYLON.Texture("https://www.babylonjs.com/assets/Flare.png", scene);
    particles.start();

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
