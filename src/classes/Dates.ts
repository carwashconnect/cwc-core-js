export class Dates {

    static toISO(timeStamp: number): string {
        return (new Date(timeStamp)).toISOString();
    }

    static toTimeStamp(date: string | number | Date): number {
        return (new Date(date)).getTime();
    }

}