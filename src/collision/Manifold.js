import { Vec2 } from '../geometry/Vec2.js';

/**
 * Manifold class for storing collision information between two bodies.
 */
export class Manifold {
    constructor(referenceBody, incidentBody) {
        this.referenceBody = referenceBody; // Reference body
        this.incidentBody = incidentBody;   // Incident body
        this.normal = new Vec2(0, 0);       // Direction of collision resolution pointing from reference to incident body
        this.penetration = 0;               // Penetration depth
        this._contacts = [];                // All contact points (raw)
    }

    isValid() { return this.contacts.length > 0 && this.penetration > 0; }

    mtv() { return this.normal.scale(this.penetration); }

    /** Returns deepest c */
    get contacts() { return this._getDeepestContacts(); }

    /** Returns all raw contacts */
    get allContacts() { return this._contacts; }

    set contacts(val) { this._contacts = val; }

    _getDeepestContacts() {
        if (this._contacts.length <= 2) return this._contacts;
    
        const contactsWithDepth = this._contacts.map(p => ({
            point: p,
            depth: this._calculateContactDepth(p)
        }));
        
        const maxDepth = Math.max(...contactsWithDepth.map(c => c.depth));
        const tolerance = 0.01;
    
        const deepest = contactsWithDepth
            .filter(c => Math.abs(c.depth - maxDepth) < tolerance)
            .map(c => c.point);
    
        if (deepest.length <= 2) return deepest;
    
        return this._selectFarthestContacts(deepest);
    }
    
    _calculateContactDepth(contactPoint) {
        // Project contact point onto the collision normal relative to referenceBody
        let minDistance = Infinity;
        for (let i = 0; i < this.referenceBody.vertices.length; i++) {
            const vertex = this.referenceBody.vertices.at(i);
            const distance = this.normal.dot(contactPoint.sub(vertex));
            minDistance = Math.min(minDistance, distance);
        }
        return Math.abs(minDistance);
    }

    _selectFarthestContacts(contacts) {
        if (contacts.length <= 2) return contacts;

        let maxDistance = 0;
        let farthestPair = [contacts[0], contacts[1]];

        for (let i = 0; i < contacts.length; i++) {
            for (let j = i + 1; j < contacts.length; j++) {
                const distance = contacts[i].distanceTo(contacts[j]);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    farthestPair = [contacts[i], contacts[j]];
                }
            }
        }

        return farthestPair;  
    }
}
