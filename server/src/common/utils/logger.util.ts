import { createLogger, format, transports } from 'winston';
import moment from 'moment';

const { combine, printf } = format;

const NODE_ENV = process.env.NODE_ENV;

// tslint:disable-next-line: no-var-requires
const { Rsyslog } = require('winston-rsyslog');

const host = process.env.SYSLOGD_HOST || '192.168.0.143';
const port = Number(process.env.SYSLOGD_PORT) || 514;
const protocol = process.env.SYSLOGD_PROTOCOL || 'U';
const tag = process.env.SYSLOGD_TAG || 'webdev';

const timestamp = () => moment().format('YYYY-MM-DD HH:mm:ss');

const logger = createLogger({
  level: NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    printf(info => `[${timestamp()}] ${info.level} ${info.message}`),
  ),
  transports: NODE_ENV === 'development'
    ? [new transports.Console()]
    : [new transports.Console(), new Rsyslog({ host, port, protocol, tag })],
});

export { logger };
