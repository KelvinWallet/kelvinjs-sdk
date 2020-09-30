import { Command } from '@oclif/command';
declare class SampleCli extends Command {
    static description: string;
    static args: {
        name: string;
        required: boolean;
    }[];
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        version: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        index: import("@oclif/parser/lib/flags").IOptionFlag<number>;
    };
    run(): Promise<void>;
}
export = SampleCli;
