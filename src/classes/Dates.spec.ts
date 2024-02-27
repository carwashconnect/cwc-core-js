import "jasmine";
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

    it("toCountdown() should convert number into a countdown string", function () {
        let time1 = 10;
        let strTime1 = "0s";
        expect(Dates.toCountdown(time1)).toEqual(strTime1);

        let time2 = 750;
        let strTime2 = "1s";
        expect(Dates.toCountdown(time2)).toEqual(strTime2);

        let time3 = 60000;
        let strTime3 = "1m 0s";
        expect(Dates.toCountdown(time3)).toEqual(strTime3);

        let time4 = 3600000;
        let strTime4 = "1h 0m 0s";
        expect(Dates.toCountdown(time4)).toEqual(strTime4);

        let time5 = 86400000;
        let strTime5 = "1d 0h 0m 0s";
        expect(Dates.toCountdown(time5)).toEqual(strTime5);

        let time6 = 86399999;
        let strTime6 = "23h 59m 59s";
        expect(Dates.toCountdown(time6)).toEqual(strTime6);

        let time7 = 90061000;
        let strTime7 = "1d 1h 1m 1s";
        expect(Dates.toCountdown(time7)).toEqual(strTime7);

    });

});
