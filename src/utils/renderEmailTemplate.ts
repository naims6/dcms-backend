import ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderEmailTemplate = async (templateName: string, data: any) => {
  const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
  console.log({ templatePath });

  const template = await ejs.renderFile(templatePath, data);
  return template;
};
