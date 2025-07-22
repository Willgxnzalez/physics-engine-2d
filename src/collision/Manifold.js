import { Vec2 } from '../geometry/Vec2.js';
/**
 * Manifold class for storing collision information between two bodies.
 */
export class Manifold {
    constructor(bodyA, bodyB) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;
        this.normal = new Vec2(0, 0);        // Direction of collision resolution (from A to B) pointing from reference to incident body
        this.penetration = 0;                // Penetration depth
        this._contacts = [];
    }

    /**
     * Check if this manifold has valid contact information
     * @returns {boolean} True if manifold has valid collision data
     */
    isValid() {
        return this.contacts.length > 0 && this.penetration > 0;
    }

    /**
     * Get the minimum translation vector
     * @returns {Vec2} The minimum translation vector
     */
    mtv() {
        return this.normal.scale(this.penetration)
    }

    get contacts() {
        return this._contacts;
    }
    set contacts(val) {
        this._contacts = val;
    }

    get deepestContacts() {
        return this._getDeepestContacts();
    }

    /**
     * Get the deepest contact points for collision resolution
     * @returns {Array<Vec2>} The deepest contact points (max 2 for stability)
     */
    _getDeepestContacts() {
        if (this._contacts.length === 0) return [];
        if (this._contacts.length <= 2) return this._contacts;

        // Calculate penetration depth for each contact point
        const contactsWithDepth = this._contacts.map(contact => {
            // Project contact point onto the collision normal
            // Depth is how far the contact point is past the reference body's edge
            const depth = this._calculateContactDepth(contact);
            return { point: contact, depth: depth };
        });

        // Sort by depth (deepest first)
        contactsWithDepth.sort((a, b) => b.depth - a.depth);

        // For stability, we want at most 2 contact points
        // If we have more than 2 contacts at the same depth, choose the ones furthest apart
        if (contactsWithDepth.length === 1) {
            return [contactsWithDepth[0].point];
        }

        // Find all contacts at maximum depth (within a small tolerance)
        const maxDepth = contactsWithDepth[0].depth;
        const tolerance = 0.01;
        const deepestContacts = contactsWithDepth.filter(c => 
            Math.abs(c.depth - maxDepth) < tolerance
        );

        if (deepestContacts.length <= 2) {
            return deepestContacts.map(c => c.point);
        }

        // If we have more than 2 contacts at the same depth, 
        // choose the two that are furthest apart
        return this._selectFarthestContacts(deepestContacts.map(c => c.point));
    }

    /**
     * Calculate the penetration depth of a contact point
     * @param {Vec2} contactPoint - The contact point
     * @returns {number} The penetration depth
     */
    _calculateContactDepth(contactPoint) {
        // Find the supporting edge/vertex of the reference body along the normal
        let minDistance = Infinity;
        for (let i = 0; i < this.bodyA.vertices.length; i++) {
            const vertex = this.bodyA.vertices.at(i);
            const distance = this.normal.dot(contactPoint.sub(vertex));
            minDistance = Math.min(minDistance, distance);
        }
        return Math.abs(minDistance);
    }

    /**
     * Select the two contact points that are furthest apart
     * @param {Array<Vec2>} contacts - Contact points to choose from
     * @returns {Array<Vec2>} The two furthest contact points
     */
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