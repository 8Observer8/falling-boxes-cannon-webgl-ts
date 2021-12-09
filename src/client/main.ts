import "cannon"; // Debug
// import * as CANNON from "cannon"; // Release
import { mat4, vec3 } from "gl-matrix";
import Box from "./Box";
import ShaderProgram from "./ShaderProgram";
import VertexBuffers from "./VertexBuffers";
import { gl, WebGLContext } from "./WebGLContext";

let world: CANNON.World;
let ground: Box;
let crate1: Box;
let crate2: Box;

function main()
{
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    if (!WebGLContext.init("renderCanvas")) return;
    gl.enable(gl.DEPTH_TEST);

    const program = ShaderProgram.create();
    VertexBuffers.init(program);

    const projMatrix = mat4.create();
    mat4.perspective(projMatrix, 55 * Math.PI / 180, 1, 0.1, 500);
    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [4, 5, 15], [0, 0, 0], [0, 1, 0]);
    const projViewMatrix = mat4.create();
    mat4.mul(projViewMatrix, projMatrix, viewMatrix);

    const lightPosition = vec3.fromValues(4, 5, 10);
    const uLightPositionLocation = gl.getUniformLocation(program, "uLightPosition");
    gl.uniform3fv(uLightPositionLocation, lightPosition);

    ground = new Box(world, [0, -3, 0], [0, 0, 0, 1], [10, 1, 10],
        program, projViewMatrix, true, [0.5, 1.0, 0.5]);
    crate1 = new Box(world, [0, 5, 0], [0, 0, 0, 1], [2, 2, 2],
        program, projViewMatrix, false, [0.396, 0.235, 0.745]);
    crate2 = new Box(world, [1, 10, 0], [0, 0, 0, 1], [2, 2, 2],
        program, projViewMatrix, false, [0.745, 0.235, 0.470]);

    gl.clearColor(0.2, 0.2, 0.2, 1);
    createPhysicsSimulation();
    draw();
}

function draw(): void
{
    requestAnimationFrame(() => draw());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    ground.draw();
    crate1.draw();
    crate2.draw();
}

function createPhysicsSimulation(): void
{
    setInterval(
        () =>
        {
            updatePhysics();
        }, 15);
}

function updatePhysics(): void
{
    world.step(0.015)
    crate1.update();
    crate2.update();
}

// Debug
main();

// Release
// window.onload = () => main();
