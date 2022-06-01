import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAllMovies() {
    return this.movieService.getMovies();
  }
}
