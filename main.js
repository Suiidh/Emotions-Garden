const canvas = document.getElementById("renderCanvas");
if (!canvas) {
    throw new Error("Canvas manquant");
}
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0.1, 1);

    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "serre.glb", scene).then((result) => {
        result.meshes.forEach((mesh) => {
            mesh.position = new BABYLON.Vector3(0, 0, 0);
            mesh.scaling = new BABYLON.Vector3(14, 14, 14);
            mesh.isPickable = false;
        });
    });

    // Charger et dupliquer les arbres séparément
    let tree1 = null;
    let tree2 = null;
    let tree3 = null;
    let tree1Clones = [];
    let tree2Clones = [];
    let tree3Clones = [];

    // Positions fixes des arbres principaux
    const tree1Position = new BABYLON.Vector3(-39.72, 0, -129.58);
    const tree2Position = new BABYLON.Vector3(23.30, 0, -133.51);
    const tree3Position = new BABYLON.Vector3(75.49, 0, -100.81);

    // Positions fixes pour les clones
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

    // Chargement et clonage de tree1
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
    }).catch((error) => {
        console.error("Erreur lors du chargement de tree1.glb :", error);
    });

    // Chargement et clonage de tree2
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
    }).catch((error) => {
        console.error("Erreur lors du chargement de tree2.glb :", error);
    });

    // Chargement et clonage de tree3
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
    }).catch((error) => {
        console.error("Erreur lors du chargement de tree3.glb :", error);
    });

    // Variable pour stocker horror_tree
    let horrorTree = null;

    // Charger le banc
    let bench = null;
    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "bench.glb", scene).then((result) => {
        bench = result.meshes[0];
        bench.position = new BABYLON.Vector3(-50, 0, 100); // Près du centre, légèrement décalé
        bench.scaling = new BABYLON.Vector3(25, 25, 25);   // Échelle raisonnable pour un banc
        bench.rotation = new BABYLON.Vector3(0, -10, 0);
        bench.isPickable = false;
    }).catch((error) => {
        console.error("Erreur lors du chargement de bench.glb :", error);
    });

    // Charger et cloner les pommes de pin
    let pineCone = null;
    let pineConeClones = [];
    const pineConePositions = [
        new BABYLON.Vector3(-35, 0, -125),  // Près de tree1
        new BABYLON.Vector3(25, 0, -130),   // Près de tree2
        new BABYLON.Vector3(80, 0, -95),    // Près de tree3
        new BABYLON.Vector3(-110, 0, 60),   // Près d’un clone de tree2
        new BABYLON.Vector3(-95, 0, -95)    // Près d’un clone de tree3
    ];

    BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "pine_cone.glb", scene).then((result) => {
        pineCone = result.meshes[0];
        pineCone.position = pineConePositions[0];
        pineCone.scaling = new BABYLON.Vector3(1, 1, 1); // Petite échelle pour une pomme de pin
        pineCone.isPickable = false;

        pineConePositions.slice(1).forEach((pos, index) => {
            const clone = pineCone.clone(`pine_cone_clone_${index}`);
            clone.position = pos;
            clone.scaling = new BABYLON.Vector3(1, 1, 1);
            clone.isPickable = false;
            pineConeClones.push(clone);
        });
    }).catch((error) => {
        console.error("Erreur lors du chargement de pine_cone.glb :", error);
    });

    // Sol
    const ground = BABYLON.MeshBuilder.CreateDisc("ground", { radius: 200, tessellation: 64 }, scene);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -0.1;
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    ground.material.diffuseTexture = new BABYLON.Texture("/textures/grass.jpg", scene);
    ground.material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.isPickable = false;

    let currentDome = new BABYLON.PhotoDome("starDome", "/textures/background.jpg", { resolution: 32, size: 1000 }, scene);
    currentDome.isPickable = false;

    const moods = [
        { name: "Joie", sphere: null, position: new BABYLON.Vector3(-80, 5, 0), color: new BABYLON.Color3(1, 0.8, 0), background: "/textures/background-joie.jpg", groundTexture: "/textures/grass.jpg" },
        { name: "Peur", sphere: null, position: new BABYLON.Vector3(0, 4, 0), color: new BABYLON.Color3(0.4, 0.1, 1), background: "/textures/background2.jpg", groundTexture: "/textures/dark_forest.jpg" },
        { name: "Colere", sphere: null, position: new BABYLON.Vector3(80, 4, 0), color: new BABYLON.Color3(1, 0, 0), background: "/textures/background-colere.jpg", groundTexture: "/textures/lava.jpg" },
        { name: "Triste", sphere: null, position: new BABYLON.Vector3(0, 4, 80), color: new BABYLON.Color3(0, 0.5, 1), background: "/textures/background-triste.jpg", groundTexture: "/textures/grass.jpg" },
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

    const stars = new BABYLON.ParticleSystem("stars", 1000, scene);
    stars.emitter = new BABYLON.Vector3(0, 0, 0);
    stars.minEmitBox = new BABYLON.Vector3(-500, -500, -500);
    stars.maxEmitBox = new BABYLON.Vector3(500, 500, 500);
    stars.particleTexture = new BABYLON.Texture("/textures/butterfly.png", scene);
    stars.color1 = new BABYLON.Color4(1, 1, 1, 1);
    stars.color2 = new BABYLON.Color4(0.8, 0.8, 1, 0.8);
    stars.minSize = 0.1;
    stars.maxSize = 0.5;
    stars.emitRate = 200;
    stars.minLifeTime = 0.5;
    stars.maxLifeTime = 2.0;
    stars.start();

    const particles = new BABYLON.ParticleSystem("sparkles", 2000, scene);
    particles.emitter = new BABYLON.Vector3(0, 40, 0);
    particles.minEmitBox = new BABYLON.Vector3(-120, -10, -120);
    particles.maxEmitBox = new BABYLON.Vector3(320, 160, 320);
    particles.particleTexture = new BABYLON.Texture("/textures/butterfly.png", scene);
    particles.color1 = new BABYLON.Color4(1, 1, 1, 1);
    particles.color2 = new BABYLON.Color4(0.5, 0.5, 1, 1);
    particles.minSize = 0.05;
    particles.maxSize = 0.2;
    particles.emitRate = 2000;
    particles.start();

    const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 2, Math.PI / 2, 280, new BABYLON.Vector3(0, 40, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 80;
    camera.upperRadiusLimit = 600;
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI / 2;

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

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

    const screamerPlane = BABYLON.MeshBuilder.CreatePlane("screamerPlane", { size: 50 }, scene);
    screamerPlane.position = new BABYLON.Vector3(0, 20, 0);
    screamerPlane.isVisible = false;
    const screamerMaterial = new BABYLON.StandardMaterial("screamerMat", scene);
    screamerMaterial.diffuseTexture = new BABYLON.Texture("/textures/phantom.png", scene);
    screamerMaterial.emissiveColor = new BABYLON.Color3(0.8, 0.8, 1);
    screamerMaterial.diffuseTexture.hasAlpha = true;
    screamerPlane.material = screamerMaterial;
    const screamerSound = new BABYLON.Sound("screamerSound", "/sounds/scream.mp3", scene, null, { autoplay: false, loop: false });

    const triggerScreamer = (callback) => {
        screamerPlane.isVisible = true;
        screamerSound.play();
        screamerPlane.position = camera.position.add(camera.getDirection(BABYLON.Vector3.Forward()).scale(50));
        screamerPlane.lookAt(camera.position);
        let time = 0;
        const animation = scene.registerBeforeRender(() => {
            time += engine.getDeltaTime() / 1000;
            const scale = 1 + Math.sin(time * 10) * 0.2;
            screamerPlane.scaling = new BABYLON.Vector3(scale, scale, scale);
            screamerPlane.position.z -= time * 20;
            if (time >= 2) {
                screamerPlane.isVisible = false;
                screamerPlane.position = new BABYLON.Vector3(0, 20, 0);
                screamerPlane.scaling = new BABYLON.Vector3(1, 1, 1);
                scene.unregisterBeforeRender(animation);
                if (callback) callback();
            }
        });
    };

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

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

    const lastMessageIndex = {
        "Joie": -1,
        "Peur": -1,
        "Colere": -1,
        "Triste": -1
    };

    const getRandomMessage = (moodName) => {
        const messages = moodMessages[moodName];
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * messages.length);
        } while (newIndex === lastMessageIndex[moodName] && messages.length > 1);

        lastMessageIndex[moodName] = newIndex;
        return messages[newIndex];
    };

    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
            const pickResult = pointerInfo.pickInfo;

            if (pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.metadata) {
                const sphere = pickResult.pickedMesh;
                const newBackground = sphere.metadata.background;
                const newGroundTexture = sphere.metadata.groundTexture;
            if (pickResult.hit && pickResult.pickedMesh) {
                const mesh = pickResult.pickedMesh;

                // Vérifier si c'est une sphère avec metadata
                if (mesh.metadata && mesh.metadata.name && mesh.metadata.background) {
                    const newBackground = mesh.metadata.background;

                    // Gestion spéciale pour "Peur"
                    if (mesh.metadata.name === "Peur") {
                        // Supprimer les arbres existants et leurs clones
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

                        // Charger horror_tree s'il n'est pas déjà chargé
                        if (!horrorTree) {
                            BABYLON.SceneLoader.ImportMeshAsync("", "/objs/", "horror_tree.glb", scene).then((result) => {
                                horrorTree = result.meshes[0];
                                horrorTree.position = new BABYLON.Vector3(60, 0, -100);
                                horrorTree.rotation = new BABYLON.Vector3(0,-8,0)
                                horrorTree.scaling = new BABYLON.Vector3(25, 25, 25);
                                horrorTree.isPickable = false;
                                notification.text = "Peur : Un arbre terrifiant apparaît !";
                                setTimeout(() => {
                                    notification.text = "";
                                }, 3000);
                            }).catch((error) => {
                                console.error("Erreur lors du chargement de horror_tree.glb :", error);
                            });
                        }
                    } else {
                        // Si on clique sur une autre sphère, supprimer horror_tree et recharger les arbres
                        if (horrorTree) {
                            horrorTree.dispose();
                            horrorTree = null;

                            // Recharger tree1 et ses clones
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

                            // Recharger tree2 et ses clones
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

                            // Recharger tree3 et ses clones
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
                    }

                loader.isVisible = true;

                butterflies.stop();
                rain.stop();
                stopFireInstantly();
                thunderSystem.stopThunder();
                screamerPlane.isVisible = false;
                    // Gestion de la pluie pour "Triste"
                    if (mesh.metadata.name === "Triste") {
                        if (!rain.isStarted()) {
                            rain.start();
                            notification.text = "Tristesse : Une pluie douce tombe, reflétant une mélancolie apaisante.";
                            setTimeout(() => {
                                rain.stop();
                                notification.text = "";
                            }, 5000);
                        }
                    } else {
                        if (rain.isStarted()) {
                            rain.stop();
                            notification.text = "";
                        }
                    }

                    // Gestion du tonnerre pour "Colere"
                    if (mesh.metadata.name === "Colere") {
                        if (!thunderSystem.thunderInterval) {
                            thunderSystem.startThunder();
                            notification.text = "Colère : Le tonnerre gronde, exprimant une rage intense.";
                            setTimeout(() => {
                                thunderSystem.stopThunder();
                                notification.text = "";
                            }, 5000);
                        }
                    } else {
                        thunderSystem.stopThunder();
                    }

                notification.text = getRandomMessage(sphere.metadata.name);

                if (currentDome) {
                    currentDome.dispose();
                }
                currentDome = new BABYLON.PhotoDome("starDome", newBackground, { resolution: 32, size: 1000 }, scene);
                currentDome.isPickable = false;

                ground.material.diffuseTexture = new BABYLON.Texture(newGroundTexture, scene);

                switch (sphere.metadata.name) {
                    case "Joie":
                        butterflies.start();
                        setTimeout(() => {
                            loader.isVisible = false;
                        }, 1000);
                        break;

                    case "Peur":
                        triggerScreamer(() => {
                            thunderSystem.startThunder();
                            loader.isVisible = false;
                        });
                        setTimeout(() => {
                            loader.isVisible = false;
                        }, 1000);
                        break;

                    case "Colere":
                        fire.emitter = currentDome;
                        fire.start();
                        thunderSystem.startThunder();
                        setTimeout(() => {
                            loader.isVisible = false;
                        }, 1000);
                        break;

                    case "Triste":
                        rain.start();
                        setTimeout(() => {
                            loader.isVisible = false;
                        }, 1000);
                        break;
                }
                    // Changer le fond
                    if (currentDome) {
                        currentDome.dispose();
                    }
                    currentDome = new BABYLON.PhotoDome("starDome", newBackground, { resolution: 32, size: 1000 }, scene);
                    currentDome.isPickable = false;
                    console.log(`Background changé pour : ${mesh.metadata.name} (${newBackground})`);
                }
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