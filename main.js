const canvas = document.getElementById("renderCanvas");
if (!canvas) {
    console.error("Canvas introuvable !");
    throw new Error("Canvas manquant");
}
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0.1, 1);

    // Charger la serre
    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "serre.glb", scene).then((result) => {
        result.meshes.forEach((mesh) => {
            mesh.position = new BABYLON.Vector3(0, 0, 0);
            mesh.scaling = new BABYLON.Vector3(14, 14, 14);
            mesh.isPickable = false;
        });
    }).catch((error) => {
        console.error("Erreur lors du chargement de serre.glb :", error);
    });

    // Sol
    const ground = BABYLON.MeshBuilder.CreateDisc("ground", { radius: 200, tessellation: 64 }, scene);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -0.1;
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseTexture = new BABYLON.Texture("/textures/grass.jpg", scene);
    ground.material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.isPickable = false;

    // Fond étoilé initial
    let currentDome = new BABYLON.PhotoDome("starDome", "/textures/background.jpg", { resolution: 32, size: 1000 }, scene);
    currentDome.isPickable = false;

    // Définition des humeurs
    const moods = [
        { name: "Joie", sphere: null, position: new BABYLON.Vector3(-80, 5, 0), color: new BABYLON.Color3(1, 0.8, 0), background: "/textures/background.jpg" },
        { name: "Peur", sphere: null, position: new BABYLON.Vector3(0, 4, 0), color: new BABYLON.Color3(0.5, 0.5, 0.8), background: "/textures/background3.jpg" },
        { name: "Colere", sphere: null, position: new BABYLON.Vector3(80, 4, 0), color: new BABYLON.Color3(1, 0, 0), background: "/textures/background4.jpg" },
        { name: "Triste", sphere: null, position: new BABYLON.Vector3(0, 4, 80), color: new BABYLON.Color3(0, 0.5, 1), background: "/textures/background2.jpg" },
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
        sphere.isPickable = true;
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

    // Lumière ambiante
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Système de pluie
    const rain = new BABYLON.ParticleSystem("rain", 20000, scene);
    rain.particleTexture = new BABYLON.Texture("textures/water-drop.png", scene);
    rain.emitter = new BABYLON.Vector3(0, 120, 0);
    rain.minEmitBox = new BABYLON.Vector3(-150, -50, -150);
    rain.maxEmitBox = new BABYLON.Vector3(150, 0, 150);
    rain.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 0.8);
    rain.color2 = new BABYLON.Color4(0.5, 0.7, 1.0, 0.6);
    rain.colorDead = new BABYLON.Color4(0, 0, 1, 0);
    rain.minSize = 1;
    rain.maxSize = 2;
    rain.emitRate = 5000;
    rain.direction1 = new BABYLON.Vector3(0, -1, 0);
    rain.direction2 = new BABYLON.Vector3(0, -1, 0);
    rain.minEmitPower = 5;
    rain.maxEmitPower = 10;
    rain.gravity = new BABYLON.Vector3(0, -190.81, 0);
    rain.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    rain.isPickable = false;

    // Système de tonnerre
    const createThunderSystem = () => {
        const thunderLight = new BABYLON.PointLight("thunderLight", new BABYLON.Vector3(0, 100, 0), scene);
        thunderLight.intensity = 0;
        thunderLight.diffuse = new BABYLON.Color3(0.8, 0.9, 1);
        thunderLight.specular = new BABYLON.Color3(1, 1, 1);

        const thunderSounds = [
            new BABYLON.Sound("thunder1", "sounds/thunder1.mp3", scene, null, { autoplay: false, loop: false }),
            new BABYLON.Sound("thunder2", "sounds/thunder2.mp3", scene, null, { autoplay: false, loop: false }),
            new BABYLON.Sound("thunder3", "sounds/thunder3.mp3", scene, null, { autoplay: false, loop: false })
        ];

        const triggerThunder = () => {
            const randomSound = thunderSounds[Math.floor(Math.random() * thunderSounds.length)];
            thunderLight.intensity = 2.0;
            setTimeout(() => {
                thunderLight.intensity = 0;
            }, 100 + Math.random() * 200);
            setTimeout(() => {
                randomSound.play();
            }, Math.random() * 500);
        };

        let thunderInterval = null;
        const startThunder = () => {
            if (!thunderInterval) {
                thunderInterval = setInterval(() => {
                    triggerThunder();
                }, 2000 + Math.random() * 4000);
            }
        };

        const stopThunder = () => {
            if (thunderInterval) {
                clearInterval(thunderInterval);
                thunderInterval = null;
            }
            thunderLight.intensity = 0;
        };

        return { startThunder, stopThunder };
    };

    const thunderSystem = createThunderSystem();

    // Interface GUI
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const notification = new BABYLON.GUI.TextBlock();
    notification.text = "";
    notification.color = "white";
    notification.fontSize = 24;
    notification.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    notification.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    notification.paddingTop = "20px";
    notification.paddingRight = "20px";
    advancedTexture.addControl(notification);

    // Gestion des clics
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
            const pickResult = pointerInfo.pickInfo;

            if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.metadata) {
                const sphere = pickResult.pickedMesh;
                const newBackground = sphere.metadata.background;

                // Gestion de la pluie pour "Triste"
                if (sphere.metadata.name === "Triste") {
                    if (!rain.isStarted()) {
                        rain.start();
                        notification.text = "Tristesse : Une pluie douce tombe, reflétant une mélancolie apaisante.";
                        setTimeout(() => {
                            rain.stop();
                            notification.text = "";
                        }, 5000); // Arrête la pluie après 5 secondes
                    }
                } else {
                    if (rain.isStarted()) {
                        rain.stop();
                        notification.text = "";
                    }
                }

                // Gestion du tonnerre pour "Colere"
                if (sphere.metadata.name === "Colere") {
                    if (!thunderSystem.thunderInterval) { // Vérifie si le tonnerre n'est pas déjà actif
                        thunderSystem.startThunder();
                        notification.text = "Colère : Le tonnerre gronde, exprimant une rage intense.";
                        setTimeout(() => {
                            thunderSystem.stopThunder();
                            notification.text = "";
                        }, 5000); // Arrête le tonnerre après 5 secondes
                    }
                } else {
                    thunderSystem.stopThunder();
                }

                // Changer le fond
                if (currentDome) {
                    currentDome.dispose();
                }
                currentDome = new BABYLON.PhotoDome("starDome", newBackground, { resolution: 32, size: 1000 }, scene);
                currentDome.isPickable = false;
                console.log(`Background changé pour : ${sphere.metadata.name} (${newBackground})`);
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