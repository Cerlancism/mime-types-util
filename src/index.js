//@ts-check

import mime from "mime-types";

/**
 * @typedef MimeMethod
 * @type {"lookup" | "contentType" | "extension"}
 */

let query = new URLSearchParams(window.location.search);
let state = {};

/** @type {HTMLFormElement} */
const form = document.querySelector("form");

/** @type {HTMLSelectElement} */
const methodInputElem = form.querySelector("div > select[name='method']");

/** @type {HTMLInputElement} */
const stringInputElem = form.querySelector("div > input[name='input']");

/** @type {HTMLInputElement} */
const outputElem = form.querySelector("div > input[name='output']");

/** @type {HTMLInputElement} */
const copyButton = form.querySelector("div > div > button[name='copy']");

function getSelection()
{
  const methodOptions = methodInputElem.options;
  const methodSelectedIndex = methodInputElem.selectedIndex;

  return /** @type {MimeMethod} */ (methodOptions[methodSelectedIndex].value);
}

function getInput()
{
  return stringInputElem.value;
}

function load()
{
  if (query.has("method"))
  {
    methodInputElem.value = query.get("method");
  }
  else
  {
    methodInputElem.value = "lookup"
  }

  if (query.has("input"))
  {
    stringInputElem.value = query.get("input");
  }
  else
  {
    stringInputElem.value = ".js"
  }
  process();
}

function process()
{
  console.log("processing");
  const methodInputValue = getSelection();
  const stringInputValue = getInput();

  console.log({ methodInputValue, stringInputValue });

  try
  {
    outputElem.value = processMIME(methodInputValue, stringInputValue) || "Error";
  }
  catch (error)
  {
    if (error instanceof Error)
    {
      console.error(error);
      outputElem.value = error.message;
    }
  }

  state = query.toString();
  query.set("method", methodInputValue);
  query.set("input", stringInputValue);
}

/**
 *
 * @param {MimeMethod} method
 * @param {string} input
 */
function processMIME(method, input)
{
  switch (method)
  {
    case "lookup":
    case "contentType":
    case "extension":
      return mime[method](input);
    default:
      throw new Error("Bad MIME method");
  }
}

load();

form.addEventListener("submit", event =>
{
  event.preventDefault();

  process();

  window.history.pushState(state, null, "?" + query.toString());
});

copyButton.addEventListener("click", event =>
{
  console.log("copied")
  navigator.clipboard.writeText(outputElem.value);
});

window.addEventListener("popstate", event =>
{
  query = new URLSearchParams(window.location.search);
  console.log("Pop state", query.toString());
  load();
});
