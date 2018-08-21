import { Dates } from "./Dates"
describe("Dates", function () {

    it("toISO() should convert time to ISO string", function () {
        let time = 1534264485715;
        let strTime = "2018-08-14T16:34:45.715Z";
        expect(Dates.toISO(time)).toEqual(strTime);
    });

    it("toTimeStamp() should convert a date to a time stamp", function () {
        let time = 1534264485715;
        let date = new Date(time);
        expect(Dates.toTimeStamp(date)).toEqual(time);
    });

    it("toTimeStamp() should convert a string to a time stamp", function () {
        let time = 1534264485715;
        let strTime = "2018-08-14T16:34:45.715Z";
        expect(Dates.toTimeStamp(strTime)).toEqual(time);
    });

});
