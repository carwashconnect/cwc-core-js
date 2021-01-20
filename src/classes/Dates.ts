export class Dates {

    static toCountdown(date: string | number | Date): string {
        let time = (new Date(date)).getTime();
        let days = Math.floor(time / 86400000);
        time = time - days * 86400000;
        let hours = Math.floor(time / 3600000);
        time = time - hours * 3600000;
        let minutes = Math.floor(time / 60000);
        time = time - minutes * 60000;
        let seconds = minutes || hours || days ? Math.floor(time / 1000) : Math.round(time / 1000);
        return `${days ? `${days}d ` : ``}${hours || days ? `${hours}h ` : ``}${minutes || hours || days ? `${minutes}m ` : ``}${seconds}s`;
    }

    static toISO(timeStamp: number): string {
        return (new Date(timeStamp)).toISOString();
    }

    static toTimeStamp(date: string | number | Date): number {
        return (new Date(date)).getTime();
    }

}