import firebase from "firebase";
import sinon from "sinon";
import { AccountService } from "../account";

describe("Account tests", () => {
  /** @type AccountService */
  let accountService;

  beforeEach(() => {
    accountService = new AccountService();
    firebase.restore();
  });

  afterEach(() => {
    firebase.restore();
  });

  it("should process profile login", () => {
    expect(
      AccountService.processProfile("CodeCombat", "ABC_ DE!#@%FG")
    ).toEqual("abc--defg");
    expect(
      AccountService.processProfile("NotCodeCombat", "ABC_ DE!#@%FGh")
    ).toEqual("ABC_ DE!#@%FGh");
  });

  it("should process signIn", () => {
    firebase.configure({
      authStub: sinon.stub(),
      refStub: sinon.stub()
    });
    firebase.authStub.returns({
      signInWithPopup: () =>
        Promise.resolve({
          user: {
            displayName: "testUser",
            email: "test@te.st",
            photoURL: "test",
            uid: "deadbeef"
          }
        })
    });
    firebase.refStub.withArgs("/users/deadbeef").returns({
      once: () =>
        Promise.resolve({
          val: () => ({})
        }),
      update: data =>
        expect(data).toEqual({ displayName: "testUser", photoURL: "test" })
    });
    firebase.refStub.withArgs("/usersPrivate/deadbeef").returns({
      update: data =>
        expect(data).toEqual({ displayName: "testUser", email: "test@te.st" })
    });
    accountService.signIn();
  });
});
