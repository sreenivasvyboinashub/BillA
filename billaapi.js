import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const response = openai.responses.create({
  model: "gpt-5-nano",
  input: "Say My name is Siri",
  store: true,
});

response.then((result) => console.log(result.output_text));