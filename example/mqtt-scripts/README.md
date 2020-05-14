Install dependencies by `cd` into this directory and invoking:

    npm install

If you don't have `npm` installed on you machine, use Docker instead:

    docker run --rm -v $(pwd):/app -w /app node npm install