export class Renderer {
    static render(ctx, bodies) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        for (const body of bodies) {
            ctx.beginPath();
            ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
            for (let i = 1; i < body.vertices.length; i++) {
                ctx.lineTo(body.vertices[i].x, body.vertices[i].y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }
}