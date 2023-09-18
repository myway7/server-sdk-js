"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenVerifier = exports.AccessToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
// 6 hours
const defaultTTL = 6 * 60 * 60;
class AccessToken {
    /**
     * Creates a new AccessToken
     * @param apiKey API Key, can be set in env LIVEKIT_API_KEY
     * @param apiSecret Secret, can be set in env LIVEKIT_API_SECRET
     */
    constructor(apiKey, apiSecret, options) {
        if (!apiKey) {
            apiKey = process.env.LIVEKIT_API_KEY;
        }
        if (!apiSecret) {
            apiSecret = process.env.LIVEKIT_API_SECRET;
        }
        if (!apiKey || !apiSecret) {
            throw Error('api-key and api-secret must be set');
        }
        // else if (typeof document !== 'undefined') {
        //   // check against document rather than window because deno provides window
        //   console.error(
        //     'You should not include your API secret in your web client bundle.\n\n' +
        //       'Your web client should request a token from your backend server which should then use ' +
        //       'the API secret to generate a token. See https://docs.livekit.io/client/connect/',
        //   );
        // }
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.grants = {};
        this.identity = options === null || options === void 0 ? void 0 : options.identity;
        this.ttl = (options === null || options === void 0 ? void 0 : options.ttl) || defaultTTL;
        if (options === null || options === void 0 ? void 0 : options.metadata) {
            this.metadata = options.metadata;
        }
        if (options === null || options === void 0 ? void 0 : options.name) {
            this.name = options.name;
        }
    }
    /**
     * Adds a video grant to this token.
     * @param grant
     */
    addGrant(grant) {
        this.grants.video = grant;
    }
    /**
     * Set metadata to be passed to the Participant, used only when joining the room
     */
    set metadata(md) {
        this.grants.metadata = md;
    }
    set name(name) {
        this.grants.name = name;
    }
    get sha256() {
        return this.grants.sha256;
    }
    set sha256(sha) {
        this.grants.sha256 = sha;
    }
    /**
     * @returns JWT encoded token
     */
    toJwt() {
        // TODO: check for video grant validity
        var _a;
        const opts = {
            issuer: this.apiKey,
            expiresIn: this.ttl,
            notBefore: 0,
        };
        if (this.identity) {
            opts.subject = this.identity;
            opts.jwtid = this.identity;
        }
        else if ((_a = this.grants.video) === null || _a === void 0 ? void 0 : _a.roomJoin) {
            throw Error('identity is required for join but not set');
        }
        return jwt.sign(this.grants, this.apiSecret, opts);
    }
}
exports.AccessToken = AccessToken;
class TokenVerifier {
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }
    verify(token) {
        const decoded = jwt.verify(token, this.apiSecret, { issuer: this.apiKey });
        if (!decoded) {
            throw Error('invalid token');
        }
        return decoded;
    }
}
exports.TokenVerifier = TokenVerifier;
//# sourceMappingURL=AccessToken.js.map