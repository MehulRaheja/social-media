/* eslint-disable @typescript-eslint/no-explicit-any */
// to generate fake but reasonable data
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { floor, random } from 'lodash';
import axios from 'axios';
import { createCanvas } from 'canvas';

dotenv.config({});

function avatarColor(): string {
  const colors: string[] = [
    '#f44336',
    '#e91e63',
    '#2196f3',
    '#9c27b0',
    '#3f51b5',
    '#00bcd4',
    '#4caf50',
    '#ff9800',
    '#8bc34a',
    '#009688',
    '#03a9f4',
    '#cddc39',
    '#2962ff',
    '#448aff',
    '#84ffff',
    '#00e676',
    '#43a047',
    '#d32f2f',
    '#ff1744',
    '#ad1457',
    '#6a1b9a',
    '#1a237e',
    '#1de9b6',
    '#d84315'
  ];
  return colors[floor(random(0.9) * colors.length)]; // selecting a random color from the above array, random func. has max value of 0.9
}

function generateAvatar(text: string, backgroundColor: string, foregroundColor = 'white') {
  const canvas = createCanvas(200, 200); // width and height of canvas
  const context = canvas.getContext('2d'); // it will be of 2d style

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height); // 0, 0 is the position in x and y direction

  // below are the style properties of the canvas(avatar)
  context.font = 'normal 80px sans-serif';
  context.fillStyle = foregroundColor;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width/2, canvas.height/2); // canvas.width/2, canvas.height/2 is the x and y position of the text inside avatar

  return canvas.toDataURL('image/png');
}

async function seedUserData(count: number): Promise<void> {
  let i = 0;
  try {
    for(i = 0; i < count; i++) {
      // const username: string = faker.unique(faker.word.adjective, [8]); // faker.unique function is deprecated
      // const username: string = faker.internet.displayName();
      let username: string = faker.person.firstName(); // creating a fake unique username
      if(username.length < 4) username = faker.person.firstName();
      // const username: string = faker.internet.userName(); // creating a fake unique username
      const color = avatarColor();
      const avatar = generateAvatar(username.charAt(0).toUpperCase(), color);

      const body = {
        username,
        email: faker.internet.email(),
        password: '12345',
        avatarColor: color,
        avatarImage: avatar
      };
      console.log(`***ADDING USER TO DATABASE*** - ${i + 1} of ${count} - ${username}`);
      await axios.post(`${process.env.API_URL}/signup`, body);
    }
  } catch (error: any) {
    console.log(error?.response?.data);
  }
}

seedUserData(10);
