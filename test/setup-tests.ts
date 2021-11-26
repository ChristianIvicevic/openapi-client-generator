import { configureLogging } from 'generator/logging';

// Configure the winston logger for testing purposes to have a transport and
// disable error messages of it not having any transports. Nevertheless, the
// logging it set to silent during tests.
configureLogging('debug');
