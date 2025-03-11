var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() {
    return new BABYLON.Engine(  canvas,
        true,
        {   preserveDrawingBuffer: true,
            stencil: true,
            disableWebGL2Support: false});
};

var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color3(0,0,0)

    //Reading Meshes from file
    let rc = BABYLON.appendSceneAsync("objs/serre.glb", scene)
        .then(
            function() {
                //STEP 1 : GET MESH NAMES
                // scene.meshes.forEach( function (mesh) {
                //     mesh.actionManager = new BABYLON.ActionManager(scene)
                //     mesh.actionManager.registerAction(
                //         new BABYLON.ExecuteCodeAction(
                //         {
                //             trigger: BABYLON.ActionManager.OnLeftPickTrigger,
                //         },
                //         function(evt) {
                //             console.log(evt.meshUnderPointer.name)
                //         }
                //     )
                // )
                // })

                //STEP 2: GET ONLY TWO MESHES
                // scene.meshes.forEach( function (mesh) {
                //     if (mesh.name != "__root__" &&
                //         mesh.name != "house_002" &&
                //         mesh.name != "cactus_001"
                //     ) {
                //         mesh.setEnabled(false)
                //     }
                // })

                //STEP 3: POSITIONING THE MESHES
               // scene.meshes.forEach( function (mesh) {


                //ARCBALL CAMERA
                var camera = new BABYLON.ArcRotateCamera("camera",  BABYLON.Tools.ToRadians(180),
                    BABYLON.Tools.ToRadians(80), 30,
                    BABYLON.Vector3.Zero(),
                    scene)
                camera.attachControl(canvas, true)

                // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
                var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
                light.intensity = 0.7

                // Our built-in 'ground' shape.
                var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene)
            })
    return scene
}

window.initFunction = async function() {

    var asyncEngineCreation = async function() {
        try {
            return createDefaultEngine();
        } catch(e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';

    startRenderLoop(engine, canvas);

    window.scene = createScene();};

initFunction().then(() => {sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});