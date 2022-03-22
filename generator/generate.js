const fsPromise = require("fs").promises;
const fs = require("fs");
let moduleName;
process.argv.forEach(function (val, index, array) {
  if (index === 2) {
    moduleName = val;
  }
});
const generator = require(`../config/generator/${moduleName}.js`);

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

async function main() {
  try {
    //Route
    let route = await fsPromise.readFile("./generator/route.ts", "utf8");
    const newRoute = fs.createWriteStream(`./src/routes/${generator.routeVersion}/${generator.moduleName.toLowerCase()}.route.ts`, { flags: "w" });
    newRoute.write(replaceName(route));

    //Model
    let model = await fsPromise.readFile("./generator/model.ts", "utf8");
    let modelObj = ``;
    generator.parameters.forEach((param, index) => {
      if (param.ref) {
        modelObj += `  ${param.name}: {\n    type: mongoose.Types.ObjectId,\n    ref: "${param.ref}"\n  }`;
      } else {
        modelObj += `  ${param.name}: ${param.type}`;
      }

      if (index !== generator.parameters.length - 1) {
        modelObj += `,\n`;
      }
    });
    const newModel = fs.createWriteStream(`./src/models/${generator.moduleName.toLowerCase()}.model.ts`, { flags: "w" });
    let modelString = replaceName(model);
    modelString = addModelObject(modelString, modelObj);
    newModel.write(modelString);

    //Service
    let service = await fsPromise.readFile("./generator/service.ts", "utf8");
    const newService = fs.createWriteStream(`./src/services/${generator.moduleName.toLowerCase()}.service.ts`, { flags: "w" });
    newService.write(replaceName(service));

    //Controller
    let controller = await fsPromise.readFile("./generator/controller.ts", "utf8");
    let controllerObj = ``;
    generator.parameters.forEach((param, index) => {
      if (param.isSearchable) {
        controllerObj += `{ ${param.name}: { $regex: search, $options: "i" } },\n`;
      }
    });
    let controllerString = replaceName(controller);
    controllerString = addSearchQuery(controllerString, controllerObj);
    const newController = fs.createWriteStream(`./src/controllers/${generator.moduleName.toLowerCase()}.controller.ts`, { flags: "w" });
    newController.write(replaceName(controllerString));

    //Interface
    let interfaceModule = ``;
    let interfaceModuleCreate = ``;
    let interfaceModuleGet = ``;
    let interfaceModuleEdit = ``;
    generator.parameters.forEach(param => {
      if (param.ref) {
        interfaceModule += `${param.name} ?: I${toTitleCase(param.ref)};\n`;
        interfaceModuleCreate += `  ${param.name} ${param.isRequired ? ":" : "?:"} I${toTitleCase(param.ref)};\n`;
        interfaceModuleGet += `  ${param.name} ?: I${toTitleCase(param.ref)};\n`;
        interfaceModuleEdit += `  ${param.name} ?: I${toTitleCase(param.ref)};\n`;
      } else {
        interfaceModule += `  ${param.name} ?: ${param.type === "Array" ? `Array<${param.subType}>` : param.type.toLowerCase()};\n`;
        interfaceModuleCreate += `  ${param.name} ${param.isRequired ? ":" : "?:"} ${
          param.type === "Array" ? `Array<${param.subType}>` : param.type.toLowerCase()
        };\n`;
        interfaceModuleGet += `  ${param.name} ?: ${param.type === "Array" ? `Array<${param.subType}>` : param.type.toLowerCase()};\n`;
        interfaceModuleEdit += `  ${param.name} ?: ${param.type === "Array" ? `Array<${param.subType}>` : param.type.toLowerCase()};\n`;
      }
    });
    let interfaceObj = {
      module: interfaceModule,
      create: interfaceModuleCreate,
      get: interfaceModuleGet,
      edit: interfaceModuleEdit,
    };

    let interface = await fsPromise.readFile("./generator/interface.ts", "utf8");
    const newInterface = fs.createWriteStream(`./src/helpers/interface.helper.ts`, { flags: "a" });
    const interfaceString = replaceName(interface);
    newInterface.write(addInterface(interfaceString, interfaceObj));

    //Validation
    let validationCreate = ``;
    let validationEdit = ``;
    generator.parameters.forEach(param => {
      validationCreate += `${param.name}: Joi.${param.type.toLowerCase()}().${param.isRequired ? "required" : "optional"}(),\n`;
      if (param.isEditable) {
        validationEdit += `${param.name}: Joi.${param.type.toLowerCase()}().optional(),\n`;
      }
    });
    let validationObj = {
      create: validationCreate,
      edit: validationEdit,
    };

    let validation = await fsPromise.readFile("./generator/validation.ts", "utf8");
    const newValidation = fs.createWriteStream(`./src/helpers/validation.helper.ts`, { flags: "a" });
    const validationString = replaceName(validation);
    newValidation.write(addValidation(validationString, validationObj));

    //Test
    let testBodyCreate = ``;
    let testBodyEdit = ``;
    let testEditKey = ``;
    generator.parameters.forEach(param => {
      testBodyCreate += `${param.name}: ${addRandomTypes(param)},\n`;
      if (param.isEditable) {
        testBodyEdit += `${param.name}: ${addRandomTypes(param)},\n`;
      }
      if (param.isEditable && param.type !== "Array" && param.type !== "Object") {
        testEditKey = param.name;
      }
    });
    let testObj = {
      create: testBodyCreate,
      edit: testBodyEdit,
      editKey: testEditKey,
    };

    let test = await fsPromise.readFile("./generator/test.ts", "utf8");
    const newTest = fs.createWriteStream(`./__test__/${generator.moduleName.toLowerCase()}.test.ts`, { flags: "w" });
    const testString = replaceName(test);
    newTest.write(addTest(testString, testObj));

    //Constant
    let constant = await fsPromise.readFile("./generator/response.ts", "utf8");
    const newConstant = fs.createWriteStream(`./src/constants/response.constant.ts`, { flags: "a" });
    newConstant.write(replaceName(constant));

    //Define Route
    let app = await fsPromise.readFile("./src/app.ts", "utf8");
    const newApp = fs.createWriteStream(`./src/app.ts`, { flags: "w" });
    let newRouteString = defineRoute(app);
    newApp.write(replaceName(newRouteString));
  } catch (error) {
    console.log(error);
  }
}

function replaceName(string) {
  let str = string.replace(new RegExp("_MNS_", "g"), generator.moduleName);
  str = str.replace(new RegExp("_MN_", "g"), generator.moduleName.toLowerCase());
  str = str.replace(new RegExp("_MNC_", "g"), generator.moduleName.toUpperCase());
  str = str.replace("// @ts-nocheck", "");
  return str;
}

function defineRoute(string) {
  let moduleName = generator.moduleName.toLowerCase();
  let NR = `import ${moduleName}Route from "./routes/v1/${moduleName}.route";\n//_NR_`;
  let NRD = `app.use("/api/v1/${moduleName}", ${moduleName}Route);\n//_NRD_`;

  let str = string.replace(new RegExp("//_NR_", "g"), NR);
  str = str.replace(new RegExp("//_NRD_", "g"), NRD);
  return str;
}

function addModelObject(string, object) {
  string = string.replace(new RegExp("_MO_", "g"), object);
  return string;
}

function addSearchQuery(string, object) {
  string = string.replace(new RegExp("_MSEARCH_", "g"), object);
  return string;
}

function addInterface(string, interface) {
  string = string.replace(new RegExp("_IM_", "g"), interface.module);
  string = string.replace(new RegExp("_IMC_", "g"), interface.create);
  string = string.replace(new RegExp("_IMG_", "g"), interface.get);
  string = string.replace(new RegExp("_IME_", "g"), interface.edit);
  return string;
}

function addValidation(string, validation) {
  string = string.replace(new RegExp("_VC_", "g"), validation.create);
  string = string.replace(new RegExp("_VE_", "g"), validation.edit);
  return string;
}

function addTest(string, test) {
  string = string.replace(new RegExp("_TCB_", "g"), test.create);
  string = string.replace(new RegExp("_TEB_", "g"), test.edit);
  string = string.replace(new RegExp("_TEK_", "g"), test.editKey);
  return string;
}

function addRandomTypes({ type, subType, ref }) {
  let value;
  if (type.toLowerCase() === "string") {
    value = '"qwertyuiop"';
    if (ref) {
      value = '"623980a44794ef59b9024c15"';
    }
  } else if (type.toLowerCase() === "number") {
    value = 1234567890;
  } else if (type.toLowerCase() === "date") {
    value = new Date();
  } else if (type.toLowerCase() === "array") {
    if (subType.toLowerCase() === "string") {
      value = '["qwerty", "uiop"]';
    } else if (subType.toLowerCase() === "number") {
      value = "[12345, 67890]";
    }
  }
  return value;
}

main();
