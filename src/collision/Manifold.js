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
        this._contacts = [];                // Raw contact points
    }

    isValid() { 
        return this._contacts.length > 0 && this.penetration > 0; 
    }

    get allContacts() {
        return this._contacts.slice();
    }

    get contacts() {
        return this._getBestContacts();
    }

    set contacts(contactArray) {
        this._contacts = contactArray ? contactArray.slice() : [];
    }

    // Select the best contact points for stable physics
    _getBestContacts() {
        if (this._contacts.length <= 2) {
            return this._contacts;
        }

        // For more than 2 contacts, find the two that are farthest apart
        let maxDistSq = 0;
        let bestPair = [this._contacts[0], this._contacts[1]];

        for (let i = 0; i < this._contacts.length; i++) {
            for (let j = i + 1; j < this._contacts.length; j++) {
                const distSq = this._contacts[i].sub(this._contacts[j]).magSq();
                if (distSq > maxDistSq) {
                    maxDistSq = distSq;
                    bestPair = [this._contacts[i], this._contacts[j]];
                }
            }
        }

        return bestPair;
    }
}