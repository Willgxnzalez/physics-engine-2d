// Add renderer after the Engine class
export class Renderer {
    static renderBodies(ctx, bodies, debugMode = false) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;

        for (const body of bodies) {
            ctx.beginPath();

            if (body.type === 'circle') {
                ctx.arc(body.position.x, body.position.y, body.radius, 0, Math.PI * 2);
                ctx.stroke();
                
                // Draw rotation indicator line
                ctx.save();
                ctx.lineWidth = 2;
                ctx.beginPath();
                const endX = body.position.x + Math.cos(body.angle) * body.radius;
                const endY = body.position.y + Math.sin(body.angle) * body.radius;
                ctx.moveTo(body.position.x, body.position.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                ctx.restore();
            } else {
                // Draw polygons (rect, triangle, etc)
                const vertices = body.vertices.points;
                if (vertices.length > 0) {
                    const firstVertex = vertices[0];
                    ctx.moveTo(firstVertex.x, firstVertex.y);
                    for (let i = 1; i < vertices.length; i++) {
                        ctx.lineTo(vertices[i].x, vertices[i].y);
                    }
                    ctx.closePath();
                }
            }

            ctx.stroke();

            // Render center of mass
            if (debugMode) {
                ctx.save();
                ctx.fillStyle = 'cyan ';
                ctx.beginPath();
                ctx.arc(body.position.x, body.position.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Render bounding box if debug mode is enabled
            if (debugMode && body.bounds) {
                Renderer.renderBounds(ctx, body.bounds);
            }
        }
    }

    /**
     * Render contact points for debugging
     */
    static renderContacts(ctx, manifolds) {
        ctx.save();
        
        for (const manifold of manifolds) {
            // Render contact points
            const contacts = manifold.contacts;            
            ctx.fillStyle = '#A47DAB';
            ctx.strokeStyle = '#A47DAB';
            for (const contact of contacts) {
                ctx.beginPath();
                ctx.arc(contact.x, contact.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Render collision normal
            if (manifold.contacts.length > 0) {
                const contact = manifold.contacts[0];
                const normalEnd = contact.add(manifold.normal.scale(30));
                                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(contact.x, contact.y);
                ctx.lineTo(normalEnd.x, normalEnd.y);
                ctx.stroke();
                
                // Arrow head
                const angle = Math.atan2(manifold.normal.y, manifold.normal.x);
                const arrowLength = 8;
                ctx.beginPath();
                ctx.moveTo(normalEnd.x, normalEnd.y);
                ctx.lineTo(
                    normalEnd.x - arrowLength * Math.cos(angle - Math.PI / 6),
                    normalEnd.y - arrowLength * Math.sin(angle - Math.PI / 6)
                );
                ctx.moveTo(normalEnd.x, normalEnd.y);
                ctx.lineTo(
                    normalEnd.x - arrowLength * Math.cos(angle + Math.PI / 6),
                    normalEnd.y - arrowLength * Math.sin(angle + Math.PI / 6)
                );
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    /**
     * Render a bounding box for debugging
     */
    static renderBounds(ctx, bounds) {
        ctx.save();
        
        ctx.strokeStyle = '#faa900'; // Orange color for bounds
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Dashed line for bounds
        
        // Draw the bounding box rectangle
        const width = bounds.maxX - bounds.minX;
        const height = bounds.maxY - bounds.minY;
        
        ctx.strokeRect(bounds.minX, bounds.minY, width, height);
        
        // Draw corner markers for better visibility
        ctx.setLineDash([]); // Solid lines for corners
        ctx.lineWidth = 3;
        const cornerSize = 5;
        
        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(bounds.minX, bounds.minY);
        ctx.lineTo(bounds.minX + cornerSize, bounds.minY);
        ctx.moveTo(bounds.minX, bounds.minY);
        ctx.lineTo(bounds.minX, bounds.minY + cornerSize);
        ctx.stroke();
        
        // Top-right corner
        ctx.beginPath();
        ctx.moveTo(bounds.maxX, bounds.minY);
        ctx.lineTo(bounds.maxX - cornerSize, bounds.minY);
        ctx.moveTo(bounds.maxX, bounds.minY);
        ctx.lineTo(bounds.maxX, bounds.minY + cornerSize);
        ctx.stroke();
        
        // Bottom-left corner
        ctx.beginPath();
        ctx.moveTo(bounds.minX, bounds.maxY);
        ctx.lineTo(bounds.minX + cornerSize, bounds.maxY);
        ctx.moveTo(bounds.minX, bounds.maxY);
        ctx.lineTo(bounds.minX, bounds.maxY - cornerSize);
        ctx.stroke();
        
        // Bottom-right corner
        ctx.beginPath();
        ctx.moveTo(bounds.maxX, bounds.maxY);
        ctx.lineTo(bounds.maxX - cornerSize, bounds.maxY);
        ctx.moveTo(bounds.maxX, bounds.maxY);
        ctx.lineTo(bounds.maxX, bounds.maxY - cornerSize);
        ctx.stroke();
        
        ctx.restore();
    }

    /**
     * Render only bounding boxes (useful for broad-phase debugging)
     */
    static renderBoundsOnly(ctx, bodies) {
        ctx.save();
        ctx.strokeStyle = '#00ff00'; // Green for bounds-only mode
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        
        for (const body of bodies) {
            if (body.bounds) {
                const width = body.bounds.maxX - body.bounds.minX;
                const height = body.bounds.maxY - body.bounds.minY;
                ctx.strokeRect(body.bounds.minX, body.bounds.minY, width, height);
            }
        }
        
        ctx.restore();
    }
}