import mime from "mime-types";

/**
 * @typedef MimeMethod
 * @type {"LookUp" | "ContentType" | "Extension"}
 */

let query = new URLSearchParams(window.location.search);

const form = /** @type {HTMLFormElement} */ (document.querySelector("form"));

const methodInputElem = /** @type {HTMLSelectElement} */ (document.querySelector(
  "form > div > select"
));

const stringInputElem = /** @type {HTMLInputElement} */ (document.querySelector(
  "#input-string"
));

const outputElem = /** @type {HTMLInputElement} */ (document.querySelector(
  "#mime-output"
));

const copyButton = /** @type {HTMLInputElement} */ (document.querySelector(
  "#output-copy"
));

function load() {
  if (query.has("mime-method")) {
    methodInputElem.value = query.get("mime-method");
  }

  if (query.has("input-string")) {
    stringInputElem.value = query.get("input-string");
  }
  process();
}

function process() {
  console.log("processing");
  const methodOptions = methodInputElem.options;
  const methodSelectedIndex = methodInputElem.selectedIndex;
  /** @type {MimeMethod} */
  const methodInputValue = methodOptions[methodSelectedIndex].value;
  const stringInputValue = stringInputElem.value;

  console.log({ methodInputValue, stringInputValue });

  try {
    outputElem.value = processMIME(methodInputValue, stringInputValue);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      outputElem.value = error.message;
    }
  }

  query.set("mime-method", methodInputValue);
  query.set("input-string", stringInputValue);
}

/**
 *
 * @param {MimeMethod} method
 * @param {string} input
 */
function processMIME(method, input) {
  switch (method) {
    case "LookUp":
      return mime.lookup(input);

    case "ContentType":
      return mime.contentType(input);

    case "Extension":
      return mime.extension(input);

    default:
      throw new Error("Bad MIME method");
  }
}

load();

form.addEventListener("submit", event => {
  event.preventDefault();

  process();

  window.history.pushState(query, null, "?" + query.toString());
});

copyButton.addEventListener("click", event => {
  navigator.clipboard.writeText(outputElem.value);
});

window.addEventListener("popstate", event => {
  query = new URLSearchParams(window.location.search);
  console.log("Pop state", query.toString());
  load();
});
