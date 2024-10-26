import * as dotenv from 'dotenv';
import { jwtConstants } from './auth.constants';


describe('JWT Constants', () => {
  beforeAll(() => {
    dotenv.config();
  });

  it('should have a secret defined', () => {
    expect(jwtConstants.secret).toBeDefined(); 
  });

  it('should match the JWT_SECRET environment variable', () => {
    const expectedSecret = process.env.JWT_SECRET;
    expect(jwtConstants.secret).toEqual(expectedSecret); 
  });
});
