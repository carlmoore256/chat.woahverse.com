import type { IChatMessage } from "../models/chat-types";
import { generateId } from "./generateId";

export function createNewChatMessage(
    role: string = "sent",
    message: string = ""
): IChatMessage {
    return {
        id: generateId(16),
        message,
        role,
        createdAt: new Date(),
    };
}

const SUPPORTED_LANGUAGES = ["javascript", "python", "html", "css", "java", "c++"];
const CODE_BLOCK_REGEX = /```([^`]+)```/g;

/**
 * Check if the message is a code block
 */
export function messageHasCode(message: string): boolean {
    const codeBlockMatch = CODE_BLOCK_REGEX.exec(message);
    CODE_BLOCK_REGEX.lastIndex = 0;
    return codeBlockMatch !== null;
}


export function formatMessageWithCode(message: string): string {
    const codeBlockMatch = CODE_BLOCK_REGEX.exec(message);
    if (codeBlockMatch) {
        // The code block, including backticks and potential language specification
        const fullMatch = codeBlockMatch[0];
        // The content of the code block, without backticks
        const content = codeBlockMatch[1].trim();
        // Split the content into lines
        const lines = content.split("<br>");
        // The potential language is specified on the first line
        const potentialLang = lines[0];
        // Check if the first line is a known language
        if (SUPPORTED_LANGUAGES.includes(potentialLang)) {
            // Remove the first line (the language) from the lines array
            lines.shift();
            // Join the remaining lines back together
            const codeWithoutLang = lines.join("<br>");
            // Replace the matched string with formatted code, adding the language as a class
            message = message.replace(
                fullMatch,
                `<div class="code-block language-${potentialLang}"><pre><code>${codeWithoutLang}</code></pre></div>`
            );
        } else {
            // If no known language was found, revert to the previous behavior
            message = message.replace(
                fullMatch,
                `<div class="code-block"><pre><code>${content}</code></pre></div>`
            );
        }
    }
    return message;
}

export function formatLLMMessage(message: string): string {
    let formattedMessage = message.replace(/\\n/g, "\n").replace(/\n/g, "<br>");
    if (messageHasCode(formattedMessage)) {
        formattedMessage = formatMessageWithCode(formattedMessage);
    }
    return formattedMessage;
}
