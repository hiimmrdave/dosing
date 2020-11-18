async function getDrug(package_ndc) {
  const resourceRoute = `https://api.fda.gov/drug/ndc.json`,
    product = package_ndc.split("-").slice(0, -1).join("-"),
    resourceParams = `?search=product_ndc:${product}`,
    resource = `${resourceRoute}${resourceParams}`,
    response = await fetch(resource).then((res) => res.json());
  if (response.error) {
    return response;
  }
  return response.results[0];
}

function handleDrug(result) {
  output = document.getElementById("drugdata");
  if (result.error) {
    output.classList.add("error");
    output.innerHTML = `${result.error.code}: ${result.error.message}`;
  }
  if (result.product_ndc) {
    output.classList.remove("error");
    output.innerHTML = "Please confirm all data below";
    for (key in result) {
      const formItem = document.getElementById(key);
      let value = Array.isArray(result[key])
        ? result[key].join("\r\n")
        : result[key];
      if (key === "active_ingredients") {
        value = result[key]
          .reduce((acc, curr) => [...acc, `${curr.name} ${curr.strength}`], [])
          .join("\r\n");
        const dosetype = document.getElementById("dosetype"),
          ofDrug = document.getElementById("drug");
        dosetype.innerText = result[key][0].strength
          .split(" ")[1]
          .split("/")[0];
        ofDrug.innerText = "";
        if (result[key].length > 1) {
          ofDrug.innerText = ` of ${result[key][0].name}`;
        }
      }
      if (formItem) {
        formItem.setAttribute("rows", value.split("\r\n").length.toString());
        formItem.value = value;
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const fetchButton = document.getElementById("find"),
    ndcInput = document.getElementById("package_ndc");

  fetchButton.addEventListener("click", () => {
    let product = {};
    getDrug(ndcInput.value).then(handleDrug);
  });
});
