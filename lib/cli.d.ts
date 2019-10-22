import { Command, flags } from '@oclif/command';
declare class SampleCli extends Command {
    static description: string;
    static args: ({
        name: string;
        required: boolean;
        options: string[];
    } | {
        name: string;
        required: boolean;
        options?: undefined;
    })[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        version: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        account: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        pubkey: flags.IOptionFlag<string>;
        to: flags.IOptionFlag<string>;
        amount: flags.IOptionFlag<string>;
        fee: flags.IOptionFlag<string>;
        tx: flags.IOptionFlag<string>;
        tokenaddr: flags.IOptionFlag<string>;
        tokensymbol: flags.IOptionFlag<string>;
    };
    run(): Promise<void>;
}
export = SampleCli;
