export interface ProblemDetail {
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

export class AppError extends Error {
    public readonly title: string;
    public readonly status: number;
    public readonly detail: string;
    public readonly instance?: string;

    constructor(problem: ProblemDetail) {
        super(problem.detail);
        this.title = problem.title;
        this.status = problem.status;
        this.detail = problem.detail;
        if(problem.instance) this.instance = problem.instance;
    }

    toProblemDetail(): ProblemDetail {
        return {
            title: this.title,
            status: this.status,
            detail: this.detail,
            instance: this.instance,
        } as ProblemDetail;
    }
}