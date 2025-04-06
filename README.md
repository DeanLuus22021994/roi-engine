# South African ID Validation Application

A React-based web application for validating South African ID numbers, built with Next.js and MariaDB.

## Features

- Validate South African ID numbers according to government specifications
- Extract and display information from ID numbers (birthdate, gender, citizenship status)
- Light/dark mode support
- Performance-optimized implementation
- Real-time validation with helpful error messages

## Getting Started

First, set up the MariaDB database:

```bash
# Start MariaDB using Docker
docker-compose up -d
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## Technology Stack

- **Frontend**: React with Next.js (App Router)
- **Database**: MariaDB
- **Styling**: CSS Modules
- **Testing**: Jest and React Testing Library
- **Type Safety**: TypeScript
- **CI/CD**: Automated testing and deployment

## Documentation

Additional documentation can be found in the `docs` folder:

- [Requirements](./docs/requirements.md)
- [Architecture Overview](./docs/architecture_sign_off.md)
- [Implementation Plan](./docs/implementation_plan.md)
- [Testing Procedure](./docs/testing-procedure.md)
- [Next Steps](./docs/next-steps.md)

## About South African ID Validation

South African ID numbers follow a specific format that encodes personal information:

- Format: `YYMMDD SSSS 0 Z C`
- YYMMDD: Date of birth
- SSSS: Gender (Female: 0000-4999, Male: 5000-9999)
- 0: Citizen Status (0: SA Citizen, 1: Permanent Resident)
- Z: Historical digit (now standardized as 8)
- C: Checksum digit

## ROI Focus

This application is built following ROI-optimized development practices, focusing on:

- Error convergence (quick resolution of issues)
- Enhancement divergence (strategic feature development)
- Systematic testing of critical paths
- Performance optimization

## License

[MIT](https://choosealicense.com/licenses/mit/)
