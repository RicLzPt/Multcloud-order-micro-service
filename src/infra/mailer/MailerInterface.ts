export default interface MailerInterface {
    send(email: string, subject: string, message: string): Promise<void>;
}