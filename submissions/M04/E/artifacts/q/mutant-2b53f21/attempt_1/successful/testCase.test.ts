import * as QModule from "../../../../../../../../../../../../subject_repositories/q/q.js";

const Q: any = (QModule as any).default || QModule;

describe("Q unhandled rejection tracking", () => {
    it("removes a rejection from the unhandled reasons once a rejection handler is attached", (done) => {
        const failure = new Error("boom");
        const rejected = Q.reject(failure);

        expect(Q.getUnhandledReasons()).toHaveLength(1);

        const recovered = rejected.catch(() => "recovered");

        recovered.then(
            (value: string) => {
                try {
                    expect(value).toBe("recovered");
                    expect(Q.getUnhandledReasons()).toHaveLength(0);
                    done();
                } catch (error) {
                    done(error);
                }
            },
            done
        );
    });
});