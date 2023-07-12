import { PrismaClient } from '@prisma/client';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as smartContractsJson from './data/smart-contracts-data.json';

dayjs.extend(customParseFormat);

async function parseCsv(filepath: string) {
  const data = [];
  const fileTypeRegex = new RegExp(/^.*\.(mp4|png|jpeg)$/);

  const readStream = fs.createReadStream(__dirname + filepath);

  for await (const row of readStream.pipe(
    csv({
      headers: [
        'eventId',
        'title',
        'startDatetime',
        'endDatetime',
        'locationName',
        'address',
        'totalTicketsCount',
        'maxTicketsPerUser',
        'saleStartTime',
        'lineup',
        'assetUrl',
      ],
      skipLines: 1,
    }),
  )) {
    Object.keys(row).forEach((key) => {
      // Parse numbers and dates
      const toNumber = Number(row[key]);
      if (!isNaN(toNumber)) {
        row[key] = toNumber;
      }
      if (['startDatetime', 'endDatetime'].includes(key)) {
        row[key] = dayjs(row[key], 'DD/MM/YYYY HH:mm').format();
      } else if (key === 'saleStartTime') {
        row[key] = dayjs(row[key], 'DD/MM/YYYY').format();
      }
    });
    if (!fileTypeRegex.test(row.assetUrl)) {
      row.assetUrl = null;
    }
    if (!row.locationName) {
      row.locationName = null;
    }
    if (!row.lineup) {
      row.lineup = [];
    } else {
      row.lineup = row.lineup.split('-');
    }
    data.push(row);
  }

  return data;
}

// Recursively transform the keys of an object to camelCase and rename some keys
function formatJsonKeys(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // Return the object as is if it's not an object or null
  }

  if (Array.isArray(obj)) {
    // If the object is an array, recursively transform each element
    return obj.map((element) => formatJsonKeys(element));
  }

  // Transform the keys to camelCase
  const transformedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let camelCaseKey;
      if (key === 'crowdsale') {
        camelCaseKey = 'scAddress';
      } else if (key === 'collection') {
        camelCaseKey = 'collectionAddress';
      } else {
        camelCaseKey = key.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
      }
      transformedObj[camelCaseKey] = formatJsonKeys(obj[key]);
    }
  }

  return transformedObj;
}

const prisma = new PrismaClient();

async function main() {
  const events = await parseCsv('/data/organizers-data.csv');
  const ticketCollections = formatJsonKeys(smartContractsJson);

  // Reset database
  await prisma.ticketCollection.deleteMany();
  await prisma.event.deleteMany();

  // Seed database
  await prisma.event.createMany({
    data: events,
  });

  await prisma.ticketCollection.createMany({
    data: ticketCollections,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
