import { Global, Module } from '@nestjs/common';
import { InMemoryStore } from './store/in-memory.store';

@Global()
@Module({
  providers: [InMemoryStore],
  exports: [InMemoryStore],
})
export class CommonModule {}
