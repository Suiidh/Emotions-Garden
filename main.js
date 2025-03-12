const canvas = document.getElementById("renderCanvas");
if (!canvas) {
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
    }).catch((error) => console.error("Erreur lors du chargement de serre.glb :", error));

    // Charger et dupliquer les arbres
    let tree1 = null, tree2 = null, tree3 = null;
    let tree1Clones = [], tree2Clones = [], tree3Clones = [];
    const tree1Position = new BABYLON.Vector3(-39.72, 0, -129.58);
    const tree2Position = new BABYLON.Vector3(23.30, 0, -133.51);
    const tree3Position = new BABYLON.Vector3(75.49, 0, -100.81);
    const tree1AdditionalPositions = [
        new BABYLON.Vector3(113.59, 0, -53.78),
        new BABYLON.Vector3(95.70, 0, 96.76)
    ];
    const tree2AdditionalPositions = [
        new BABYLON.Vector3(12.90, 0, 129.00),
        new BABYLON.Vector3(-112.00, 0, 61.72)
    ];
    const tree3AdditionalPositions = [
        new BABYLON.Vector3(-128.41, 0, -21.89),
        new BABYLON.Vector3(-99.39, 0, -99.80)
    ];

    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree1.glb", scene).then((result) => {
        tree1 = result.meshes[0];
        tree1.position = tree1Position;
        tree1.scaling = new BABYLON.Vector3(4.7, 4.7, 4.7);
        tree1.isPickable = false;
        tree1AdditionalPositions.forEach((pos, index) => {
            const clone = tree1.clone(`tree1_clone_${index}`);
            clone.position = pos;
            clone.scaling = new BABYLON.Vector3(4.7, 4.7, 4.7);
            clone.isPickable = false;
            tree1Clones.push(clone);
        });
    }).catch((error) => console.error("Erreur lors du chargement de tree1.glb :", error));

    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree2.glb", scene).then((result) => {
        tree2 = result.meshes[0];
        tree2.position = tree2Position;
        tree2.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
        tree2.isPickable = false;
        tree2AdditionalPositions.forEach((pos, index) => {
            const clone = tree2.clone(`tree2_clone_${index}`);
            clone.position = pos;
            clone.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
            clone.isPickable = false;
            tree2Clones.push(clone);
        });
    }).catch((error) => console.error("Erreur lors du chargement de tree2.glb :", error));

    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree3.glb", scene).then((result) => {
        tree3 = result.meshes[0];
        tree3.position = tree3Position;
        tree3.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
        tree3.isPickable = false;
        tree3AdditionalPositions.forEach((pos, index) => {
            const clone = tree3.clone(`tree3_clone_${index}`);
            clone.position = pos;
            clone.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
            clone.isPickable = false;
            tree3Clones.push(clone);
        });
    }).catch((error) => console.error("Erreur lors du chargement de tree3.glb :", error));

    // Horror tree
    let horrorTree = null;

    // Charger le banc
    let bench = null;
    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "bench.glb", scene).then((result) => {
        bench = result.meshes[0];
        bench.position = new BABYLON.Vector3(-50, 0, 100);
        bench.scaling = new BABYLON.Vector3(25, 25, 25);
        bench.rotation = new BABYLON.Vector3(0, -10, 0);
        bench.isPickable = false;
    }).catch((error) => console.error("Erreur lors du chargement de bench.glb :", error));

    // Charger les pommes de pin
    let pineCone = null, pineConeClones = [];
    const pineConePositions = [
        new BABYLON.Vector3(-35, 0, -125),
        new BABYLON.Vector3(25, 0, -130),
        new BABYLON.Vector3(80, 0, -95),
        new BABYLON.Vector3(-110, 0, 60),
        new BABYLON.Vector3(-95, 0, -95)
    ];
    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "pine_cone.glb", scene).then((result) => {
        pineCone = result.meshes[0];
        pineCone.position = pineConePositions[0];
        pineCone.scaling = new BABYLON.Vector3(1, 1, 1);
        pineCone.isPickable = false;
        pineConePositions.slice(1).forEach((pos, index) => {
            const clone = pineCone.clone(`pine_cone_clone_${index}`);
            clone.position = pos;
            clone.scaling = new BABYLON.Vector3(1, 1, 1);
            clone.isPickable = false;
            pineConeClones.push(clone);
        });
    }).catch((error) => console.error("Erreur lors du chargement de pine_cone.glb :", error));

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
        { name: "Joie", sphere: null, position: new BABYLON.Vector3(-80, 5, 0), color: new BABYLON.Color3(1, 0.8, 0), background: "/textures/background-joie.jpg", groundTexture: "/textures/grass.jpg" },
        { name: "Peur", sphere: null, position: new BABYLON.Vector3(0, 4, 0), color: new BABYLON.Color3(0.4, 0.1, 1), background: "/textures/background2.jpg", groundTexture: "/textures/dark_forest.jpg" },
        { name: "Colere", sphere: null, position: new BABYLON.Vector3(80, 4, 0), color: new BABYLON.Color3(1, 0, 0), background: "/textures/background-colere.jpg", groundTexture: "/textures/lava.jpg" },
        { name: "Triste", sphere: null, position: new BABYLON.Vector3(0, 4, 80), color: new BABYLON.Color3(0, 0.5, 1), background: "/textures/background-triste.jpg", groundTexture: "/textures/grass.jpg" }
    ];

    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = 0.8;
    moods.forEach((mood) => {
        const sphere = BABYLON.MeshBuilder.CreateSphere(mood.name, { diameter: 8 }, scene);
        sphere.position = mood.position;
        sphere.material = new BABYLON.StandardMaterial(`${mood.name}Mat`, scene);
        sphere.material.emissiveColor = mood.color;
        sphere.material.specularColor = new BABYLON.Color3(1, 1, 1);
        sphere.metadata = { name: mood.name, background: mood.background, groundTexture: mood.groundTexture };
        sphere.isPickable = true;
        mood.sphere = sphere;
    });

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

    // Pluie
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

    // Feu
    const fire = new BABYLON.ParticleSystem("fire", 300, scene);
    fire.particleTexture = new BABYLON.Texture("/textures/fire.png", scene);
    fire.emitter = currentDome;
    fire.minEmitBox = new BABYLON.Vector3(-200, 0, -200);
    fire.maxEmitBox = new BABYLON.Vector3(200, -30, 200);
    fire.color1 = new BABYLON.Color4(1, 0.5, 0, 1);
    fire.color2 = new BABYLON.Color4(1, 0, 0, 1);
    fire.colorDead = new BABYLON.Color4(0.5, 0.2, 0, 0);
    fire.minSize = 15;
    fire.maxSize = 20;
    fire.emitRate = 800;
    fire.direction1 = new BABYLON.Vector3(-0.1, 1, -0.1);
    fire.direction2 = new BABYLON.Vector3(0.1, 1.5, 0.1);
    fire.minEmitPower = 5;
    fire.maxEmitPower = 10;
    fire.minLifeTime = 2;
    fire.maxLifeTime = 3;
    fire.gravity = new BABYLON.Vector3(0, 0, 0);
    fire.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    fire.updateFunction = function(particles) {
        for (let index = 0; index < particles.length; index++) {
            let particle = particles[index];
            particle.age += this._scaledUpdateSpeed;
            if (particle.age >= particle.lifeTime) {
                this.recycleParticle(particle);
                continue;
            }
            let ratio = particle.age / particle.lifeTime;
            particle.size = fire.minSize + (fire.maxSize - fire.minSize) * ratio;
            particle.position.x += particle.direction.x * this._scaledUpdateSpeed;
            particle.position.y += particle.direction.y * this._scaledUpdateSpeed;
            particle.position.z += particle.direction.z * this._scaledUpdateSpeed;
            let distanceFromCenter = BABYLON.Vector3.Distance(particle.position, BABYLON.Vector3.Zero());
            if (distanceFromCenter > 500) {
                let normalizedPos = particle.position.normalize().scale(500);
                particle.position = normalizedPos;
            }
        }
    };

    // Tonnerre
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
            setTimeout(() => thunderLight.intensity = 0, 100 + Math.random() * 200);
            setTimeout(() => randomSound.play(), Math.random() * 500);
        };
        let thunderInterval = null;
        const startThunder = () => {
            if (!thunderInterval) {
                thunderInterval = setInterval(triggerThunder, 2000 + Math.random() * 4000);
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

    // Papillons
    const butterflies = new BABYLON.ParticleSystem("butterflies", 2000, scene);
    butterflies.particleTexture = new BABYLON.Texture("textures/butterfly.png", scene);
    butterflies.emitter = new BABYLON.Vector3(0, 20, 0);
    butterflies.minEmitBox = new BABYLON.Vector3(-300, 0, -300);
    butterflies.maxEmitBox = new BABYLON.Vector3(200, 40, 200);
    butterflies.color1 = new BABYLON.Color4(1, 0.8, 0, 1);
    butterflies.color2 = new BABYLON.Color4(1, 1, 0, 1);
    butterflies.minSize = 3;
    butterflies.maxSize = 5;
    butterflies.emitRate = 100;
    butterflies.direction1 = new BABYLON.Vector3(-1, 0, -1);
    butterflies.direction2 = new BABYLON.Vector3(1, 1, 1);
    butterflies.minEmitPower = 0.5;
    butterflies.maxEmitPower = 1;

    // GUI pour la modale
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Notification existante
    const notification = new BABYLON.GUI.TextBlock();
    notification.text = "";
    notification.color = "white";
    notification.background = "black";
    notification.fontSize = 20;
    notification.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    notification.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    notification.paddingTop = "20px";
    notification.paddingRight = "20px";
    advancedTexture.addControl(notification);

    // Loader existant
    const loader = new BABYLON.GUI.Rectangle();
    loader.background = "black";
    loader.color = "white";
    loader.alpha = 0.9;
    loader.thickness = 0;
    loader.isVisible = true;
    advancedTexture.addControl(loader);

    const loaderText = new BABYLON.GUI.TextBlock();
    loaderText.text = "Chargement...";
    loaderText.color = "white";
    loaderText.fontSize = 30;
    loaderText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    loaderText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    loader.addControl(loaderText);

    setTimeout(() => {
        loader.isVisible = false;
        console.log("Chargement terminé !");
    }, 3000);

    // Modale pour le screamer
    const screamerModal = new BABYLON.GUI.Rectangle();
    screamerModal.width = 1.0; // Plein écran
    screamerModal.height = 1.0;
    screamerModal.thickness = 0; // Pas de bordure
    screamerModal.background = "transparent"; // Fond transparent
    screamerModal.isVisible = false;
    advancedTexture.addControl(screamerModal);

    const screamerImage = new BABYLON.GUI.Image("screamerImage", "/textures/screamer.png");
    screamerImage.stretch = BABYLON.GUI.Image.STRETCH_FILL; // Remplit totalement la modale
    screamerImage.width = 1.0; // 100% de la largeur
    screamerImage.height = 1.0; // 100% de la hauteur
    screamerModal.addControl(screamerImage);

    const screamerSound = new BABYLON.Sound("screamerSound", "/sounds/scream.mp3", scene, null, { autoplay: false, loop: false, volume: 1.0 });

    const triggerScreamer = (callback, newBackground, newGroundTexture) => {
        // Charger la scène "Peur" immédiatement
        if (tree1) tree1.dispose();
        if (tree2) tree2.dispose();
        if (tree3) tree3.dispose();
        tree1Clones.forEach(clone => clone.dispose());
        tree2Clones.forEach(clone => clone.dispose());
        tree3Clones.forEach(clone => clone.dispose());
        tree1 = null;
        tree2 = null;
        tree3 = null;
        tree1Clones = [];
        tree2Clones = [];
        tree3Clones = [];
        if (!horrorTree) {
            BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "horror_tree.glb", scene).then((result) => {
                horrorTree = result.meshes[0];
                horrorTree.position = new BABYLON.Vector3(60, -0.3, -100);
                horrorTree.rotation = new BABYLON.Vector3(0, -8, 0);
                horrorTree.scaling = new BABYLON.Vector3(25, 25, 25);
                horrorTree.isPickable = false;
            }).catch((error) => console.error("Erreur lors du chargement de horror_tree.glb :", error));
        }
        if (currentDome) currentDome.dispose();
        currentDome = new BABYLON.PhotoDome("starDome", newBackground, { resolution: 32, size: 1000 }, scene);
        currentDome.isPickable = false;
        ground.material.diffuseTexture = new BABYLON.Texture(newGroundTexture, scene);

        // Afficher le screamer
        screamerModal.isVisible = true;
        screamerSound.play();
        console.log("Screamer modale affichée !");

        // Masquer après 1 seconde
        setTimeout(() => {
            screamerModal.isVisible = false;
            if (callback) callback();
        }, 1000);
    };

    const stopFireInstantly = () => {
        fire.stop();
        fire.reset();
    };

    const moodMessages = {
        "Joie": [
            "Joie : Les papillons virevoltent comme des éclats de rire sous le soleil !",
            "Joie : Leur vol léger peint des sourires dans le ciel.",
            "Joie : Chaque battement d’ailes répand une douce chaleur."
        ],
        "Peur": [
            "Peur : Un cri déchire le silence de la nuit froide.",
            "Peur : Des pas invisibles résonnent dans le brouillard.",
            "Peur : Une silhouette floue guette depuis les ténèbres."
        ],
        "Colere": [
            "Colère : Le feu crépite avec une violence sauvage !",
            "Colère : Les braises dansent dans un tourbillon de haine.",
            "Colère : La chaleur étouffante hurle sa révolte."
        ],
        "Triste": [
            "Tristesse : La pluie chante une berceuse aux cœurs brisés.",
            "Tristesse : Chaque goutte traîne un soupir dans la boue.",
            "Tristesse : Le ciel pleure en silence sur un monde gris."
        ]
    };
    const lastMessageIndex = { "Joie": -1, "Peur": -1, "Colere": -1, "Triste": -1 };
    const getRandomMessage = (moodName) => {
        const messages = moodMessages[moodName];
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * messages.length);
        } while (newIndex === lastMessageIndex[moodName] && messages.length > 1);
        lastMessageIndex[moodName] = newIndex;
        return messages[newIndex];
    };

    // Gestion des clics
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
            const pickResult = pointerInfo.pickInfo;
            if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.metadata && moodMessages[pickResult.pickedMesh.metadata.name]) {
                const mesh = pickResult.pickedMesh;
                const newBackground = mesh.metadata.background;
                const newGroundTexture = mesh.metadata.groundTexture;

                // Arrêter tous les effets
                loader.isVisible = true;
                butterflies.stop();
                rain.stop();
                stopFireInstantly();
                thunderSystem.stopThunder();
                screamerModal.isVisible = false;

                // Gestion des arbres pour les autres humeurs sauf "Peur"
                if (mesh.metadata.name !== "Peur" && horrorTree) {
                    horrorTree.dispose();
                    horrorTree = null;
                    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree1.glb", scene).then((result) => {
                        tree1 = result.meshes[0];
                        tree1.position = tree1Position;
                        tree1.scaling = new BABYLON.Vector3(4.7, 4.7, 4.7);
                        tree1.isPickable = false;
                        tree1AdditionalPositions.forEach((pos, index) => {
                            const clone = tree1.clone(`tree1_clone_${index}`);
                            clone.position = pos;
                            clone.scaling = new BABYLON.Vector3(4.7, 4.7, 4.7);
                            clone.isPickable = false;
                            tree1Clones.push(clone);
                        });
                    });
                    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree2.glb", scene).then((result) => {
                        tree2 = result.meshes[0];
                        tree2.position = tree2Position;
                        tree2.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
                        tree2.isPickable = false;
                        tree2AdditionalPositions.forEach((pos, index) => {
                            const clone = tree2.clone(`tree2_clone_${index}`);
                            clone.position = pos;
                            clone.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
                            clone.isPickable = false;
                            tree2Clones.push(clone);
                        });
                    });
                    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "tree3.glb", scene).then((result) => {
                        tree3 = result.meshes[0];
                        tree3.position = tree3Position;
                        tree3.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
                        tree3.isPickable = false;
                        tree3AdditionalPositions.forEach((pos, index) => {
                            const clone = tree3.clone(`tree3_clone_${index}`);
                            clone.position = pos;
                            clone.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
                            clone.isPickable = false;
                            tree3Clones.push(clone);
                        });
                    });
                }

                // Mise à jour du dôme et du sol pour les autres humeurs sauf "Peur"
                if (mesh.metadata.name !== "Peur") {
                    if (currentDome) currentDome.dispose();
                    currentDome = new BABYLON.PhotoDome("starDome", newBackground, { resolution: 32, size: 1000 }, scene);
                    currentDome.isPickable = false;
                    ground.material.diffuseTexture = new BABYLON.Texture(newGroundTexture, scene);
                }

                // Notification
                notification.text = getRandomMessage(mesh.metadata.name);

                // Gestion des effets par humeur
                switch (mesh.metadata.name) {
                    case "Joie":
                        butterflies.start();
                        thunderSystem.stopThunder();
                        setTimeout(() => loader.isVisible = false, 1000);
                        break;
                    case "Peur":
                        triggerScreamer(() => {
                            thunderSystem.startThunder();
                            setTimeout(() => loader.isVisible = false);
                        }, newBackground, newGroundTexture);
                        break;
                    case "Colere":
                        fire.emitter = currentDome;
                        fire.start();
                        thunderSystem.startThunder();
                        setTimeout(() => loader.isVisible = false, 1000);
                        break;
                    case "Triste":
                        rain.start();
                        thunderSystem.stopThunder();
                        setTimeout(() => {
                            loader.isVisible = false;
                        }, 1000);
                        break;
                }

                console.log(`Background changé pour : ${mesh.metadata.name} (${newBackground})`);
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