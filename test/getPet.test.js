
const chai = require("chai");

const config = require("config");

const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;

describe("returns successfull status code with correct petId", () => {
 
  it("shows correct status", async () => {
    const result = await chai.request(config.get("handler.endpoint")).get("/");
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('object');
    
  });
});
