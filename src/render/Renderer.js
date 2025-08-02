export class Renderer {
    static render(ctx, bodies, debugMode = false) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        for (const body of bodies) {
            // Render the body shape
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

            // Render bounding box if debug mode is enabled
            if (debugMode && body.bounds) {
                Renderer.renderBounds(ctx, body.bounds);
            }
        }
    }

    /**
     * Render a bounding box for debugging
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Bounds} bounds - Bounding box to render
     */
    static renderBounds(ctx, bounds) {
        // Save current context state
        ctx.save();
        
        // Set bounding box style
        ctx.strokeStyle = '#faa900'; // Orange color for bounds
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dashed line for bounds
        
        // Draw the bounding box rectangle
        const width = bounds.max.x - bounds.min.x;
        const height = bounds.max.y - bounds.min.y;
        
        ctx.strokeRect(bounds.min.x, bounds.min.y, width, height);
        
        // Draw corner markers for better visibility
        ctx.setLineDash([]); // Solid lines for corners
        ctx.lineWidth = 3;
        const cornerSize = 5;
        
        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(bounds.min.x, bounds.min.y);
        ctx.lineTo(bounds.min.x + cornerSize, bounds.min.y);
        ctx.moveTo(bounds.min.x, bounds.min.y);
        ctx.lineTo(bounds.min.x, bounds.min.y + cornerSize);
        ctx.stroke();
        
        // Top-right corner
        ctx.beginPath();
        ctx.moveTo(bounds.max.x, bounds.min.y);
        ctx.lineTo(bounds.max.x - cornerSize, bounds.min.y);
        ctx.moveTo(bounds.max.x, bounds.min.y);
        ctx.lineTo(bounds.max.x, bounds.min.y + cornerSize);
        ctx.stroke();
        
        // Bottom-left corner
        ctx.beginPath();
        ctx.moveTo(bounds.min.x, bounds.max.y);
        ctx.lineTo(bounds.min.x + cornerSize, bounds.max.y);
        ctx.moveTo(bounds.min.x, bounds.max.y);
        ctx.lineTo(bounds.min.x, bounds.max.y - cornerSize);
        ctx.stroke();
        
        // Bottom-right corner
        ctx.beginPath();
        ctx.moveTo(bounds.max.x, bounds.max.y);
        ctx.lineTo(bounds.max.x - cornerSize, bounds.max.y);
        ctx.moveTo(bounds.max.x, bounds.max.y);
        ctx.lineTo(bounds.max.x, bounds.max.y - cornerSize);
        ctx.stroke();
        
        // Restore context state
        ctx.restore();
    }

    /**
     * Render only bounding boxes (useful for broad-phase debugging)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Array} bodies - Array of bodies
     */
    static renderBoundsOnly(ctx, bodies) {
        ctx.strokeStyle = '#00ff00'; // Green for bounds-only mode
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        
        for (const body of bodies) {
            if (body.bounds) {
                const width = body.bounds.max.x - body.bounds.min.x;
                const height = body.bounds.max.y - body.bounds.min.y;
                ctx.strokeRect(body.bounds.min.x, body.bounds.min.y, width, height);
            }
        }
        
        ctx.setLineDash([]);
    }
}