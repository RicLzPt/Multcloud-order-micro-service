import MailerInterface from "./MailerInterface";

export default class MailerConsole implements MailerInterface{

    async send(email: string, subject: string, message: string): Promise<void> {
        // console.log(email, subject, message);
    }

}