import { Injectable, ConsoleLogger } from "@nestjs/common";

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  override log(message: string | object) {
    const timestamp = new Date().toISOString();
    const filename = this.getFilename();
    const lineNumber = this.getLineNumber();
    const messageToLogged =
      typeof message == "string" ? message : JSON.stringify(message);

    super.log(`[${timestamp}] [${filename}:${lineNumber}] ${messageToLogged}`);
  }

  override error(message: string, trace?: string, context?: string) {
    const timestamp = new Date().toISOString();
    const filename = this.getFilename();
    const lineNumber = this.getLineNumber();

    super.error(
      `[${timestamp}] [${filename}:${lineNumber}] ${message}`,
      trace,
      context
    );
  }

  override warn(message: string) {
    const timestamp = new Date().toISOString();
    const filename = this.getFilename();
    const lineNumber = this.getLineNumber();

    super.warn(`[${timestamp}] [${filename}:${lineNumber}] ${message}`);
  }

  private getFilename(): string {
    try {
      const error = new Error();
      const stack = error.stack?.split("\n")[3]?.trim() || "";
      const filename = stack.substring(
        stack.lastIndexOf("/") + 1,
        stack.indexOf(":")
      );
      return filename || "unknown";
    } catch {
      return "unknown";
    }
  }

  private getLineNumber(): string {
    try {
      const error = new Error();
      const stack = error.stack?.split("\n")[3]?.trim() || "";
      const lineNumber = stack.substring(
        stack.lastIndexOf(":") + 1,
        stack.lastIndexOf(")")
      );
      return lineNumber || "0";
    } catch {
      return "0";
    }
  }
}
