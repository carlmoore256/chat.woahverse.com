import { isTokenExpired } from "./jwt";
import type { IChatMessage, IChatSession } from "../models/chat-types";
import { signMessage } from "./wallet";

interface TokenResponse {
    token: string;
}

class APIClient {

    public static apiURL: string = "http://localhost:3002/v1/";

    /**
     * Send a request to the server for a message to sign
     */
    static async getNonceMessage(walletAddress: string) {
        const response = await fetch(
            APIClient.apiURL + "auth/nonce/" + walletAddress,
            {
                method: "GET",
            }
        );
        if (!response.ok) {
            throw new Error("Failed to get message to sign");
        }
        const data = await response.json();
        const message = data.message;
        return message;
    }

    /**
     * Authenticates the wallet with the server, and if successful, returns a JWT token
     * @returns JWT Token
     */
    static async authenticate(walletAddress: string): Promise<{ success: boolean; error: any }> {
        try {
            // get the nonce message from the server, sign it, and send it back to verify
            const message = await this.getNonceMessage(walletAddress);
            const signature = await signMessage(message, walletAddress);

            const response = await fetch(this.apiURL + "auth/verify/", {
                method: "POST",
                credentials: "include", // we need to include this before its set
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    address: walletAddress,
                    signature,
                    message,
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                return {
                    success: false,
                    error: errorResponse.error || "Failed to authenticate",
                };
            }
            
            // if everything is ok, no need to return a token, just return success
            return { success: true, error: null };
        } catch (err) {
            // some unexpected error happened
            return { success: false, error: err.message };
        }
    }

    static async isAuthenticated(): Promise<boolean> {
        try {
            const response = await fetch(this.apiURL + "auth/is-authenticated", {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) {
                return false;
            }
            return true;
        } catch (err) {
            return false;
        }
    }

    static async newSession(): Promise<string> {
        const response = await fetch(this.apiURL + "chat/new-session", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to create a new session");
        }

        const data = await response.json();
        return data.sessionId;
    }

    static async loadSession(sessionId: string): Promise<IChatMessage[]> {
        const response = await fetch(
            this.apiURL + "chat/load-session/" + `?sessionId=${sessionId}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load the existing session");
        }

        const data = await response.json();
        const history = data.history.map((message: any) => {
            message.createdAt = new Date(message.createdAt);
            return message;
        });
        return history; // server should return session data here
    }

    static async listSessions(): Promise<IChatSession[]> {
        const response = await fetch(this.apiURL + "chat/list-sessions", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to list sessions");
        }
        const data = await response.json();
        const sessions = data.sessions.map((session: any) => {
            session.createdAt = new Date(session.createdAt);
            return session;
        });
        return sessions;
    }

    static sendMessage(
        sessionId: string,
        message: string,
        callback: (message: IChatMessage) => void
    ) {
        console.log(
            `Sending message to ${sessionId} | ${JSON.stringify({
                sessionId,
                message,
            })}`
        );
        this.postRequestSSE(
            `${this.apiURL}chat/message`,
            { sessionId, message },
            callback
        );
    }

    static postRequestSSE(url: string, data: any, callback: (data: any) => void) {
        // Make the initial POST request
        fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/event-stream", // Ensure we're accepting an SSE stream in the response
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (
                    response.headers
                        .get("Content-Type")
                        ?.includes("text/event-stream")
                ) {
                    // The response is an SSE stream
                    const reader = response.body?.getReader();
                    if (!reader) return;

                    const decoder = new TextDecoder();
                    let messageData = "";

                    return reader
                        .read()
                        .then(function processText({ done, value }) {
                            if (done) return;

                            // var decoded = decoder.decode(value);
                            messageData += decoder.decode(value, {
                                stream: true,
                            });

                            let messageEndIndex = messageData.indexOf("\n\n");
                            if (messageEndIndex !== -1) {
                                let fullMessage = messageData.substring(
                                    0,
                                    messageEndIndex + 2
                                );
                                messageData = messageData.substring(
                                    messageEndIndex + 2
                                );

                                let lines = fullMessage.split("\n");
                                lines.forEach((line) => {
                                    if (line.startsWith("data: ")) {
                                        let eventData = JSON.parse(
                                            line.slice(6)
                                        );
                                        callback(eventData);
                                    }
                                });
                            }

                            // callback(decoded.split('data: "')[1].split('"')[0]);
                            return reader.read().then(processText);
                        });
                } else {
                    // The response is a regular JSON response
                    return response.json();
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
}

export default APIClient;
