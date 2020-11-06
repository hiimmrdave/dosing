async function getDrug(package_ndc) {
  const resourceRoute = `https://api.fda.gov/drug/ndc.json`,
    resourceParams = `?search=packaging.package_ndc:${package_ndc}`,
    resource = `${resourceRoute}${resourceParams}`,
    response = (await fetch(resource).then((res) => res.json())).results[0],
    {
      product_ndc,
      active_ingredients,
      dea_schedule,
      pharm_class,
      dosage_form,
      route,
    } = response;
  return {
    product_ndc,
    active_ingredients,
    dea_schedule,
    pharm_class,
    dosage_form,
    route,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const fetchButton = document.getElementById("find"),
    ndcInput = document.getElementById("package_ndc"),
    output = document.getElementById("drugdata");

  fetchButton.addEventListener("click", () => {
    let product = {};
    getDrug(ndcInput.value).then((result) => {
      output.innerHTML = JSON.stringify(result);
    });
  });
});
