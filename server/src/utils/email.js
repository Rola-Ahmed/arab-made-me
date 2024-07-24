import nodemailer from "nodemailer";
import { asyncHandler } from "./error_handling.js";
import { Factory } from "../database/models/factory.model.js";
import { Importer } from "../database/models/importer.model.js";
export const sendMail = async (
  {
    from = process.env.EMAIL,
    to,
    cc,
    bcc,
    subject,
    html,
    attachments = []
  }
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const info = await transporter.sendMail({
    from: from, // sender address
    to: to, // list of receivers,
    cc: cc,
    bcc: bcc,
    subject: subject, // Subject line
    text: "", // plain text body
    html: html,
    attachments: attachments
  });
  console.log(info);
}


export const sendNotificationMail = async (model, id, subject) => {
  console.log("sending mail ---");
  if (model == "factory") {
    console.log("here");
    const factory = await Factory.findByPk(id)
    console.log(factory.repEmail);
    console.log(factory.emailActivated);
    console.log(factory.allowEmailNotification);
    if (factory.repEmail && factory.emailActivated && factory.allowEmailNotification) {
      console.log("here 2");
      await sendMail({
        to: factory.repEmail,
        subject: `New ${subject} has been sent to you`,
        html: `Check your dashboard at Arab-Made`
      })
    }
  } else if (model == "importer") {
    const importer = await Importer.findByPk(id)
        if(importer.repEmail && importer.emailActivated && importer.allowEmailNotification){
            await sendMail({
                to:importer.repEmail,
                subject:`New ${subject} has been sent to you`,
                html:`Check your dashboard at Arab-Made`
              })
        }
  }
}