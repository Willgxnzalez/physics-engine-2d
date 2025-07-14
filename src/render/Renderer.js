export class Renderer {
    static render(ctx, bodies) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        for (const body of bodies) {
            ctx.beginPath();
            
            const vertices = body.vertices;
            if (vertices.length > 0) {
                const firstVertex = vertices.at(0);
                ctx.moveTo(firstVertex.x, firstVertex.y);
                
                for (const vertex of vertices) {
                    ctx.lineTo(vertex.x, vertex.y);
                }
            }
            
            ctx.closePath();
            ctx.stroke();
        }
    }
}