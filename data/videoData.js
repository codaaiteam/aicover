const videoData = [
  {
    title: "A static shot of a diner at night. The door swings open and a young blind lady enters...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5t2e400030djn88wn48mz/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/01/cm2l5y213000001s6enegem0g/videoposter.webp"
  },
  {
    title: "A static shot of a diverse group of people standing on top of a high hill, overlooking a sprawling, vibrant cityscape...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5sys400010dme1xhc21od/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/01/cm2l5y029000001s6dep4asc8/videoposter.webp"
  },
  {
    title: "An FPV drone swoops through the colorful coral-lined street of an underwater neighborhood...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5st8x00010djwaal82wp0/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5xp8r000101s608gh091a/videoposter.webp"
  },
  {
    title: "A wide shot of the vast expanse of outer space, with planets and stars twinkling in the distance...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5sqwv00010djnaqpvgd6v/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5xni1000b01s6eh4d332g/videoposter.webp"
  },
  {
    title: "A close-up shot of a majestic horse's eye, with a glossy brown coat reflecting the light...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5sr6r00050dl2ccho7g5e/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5xm0r000a01s6d1rxb0gu/videoposter.webp"
  },
  {
    title: "A static shot of a chubby orange and white cat sitting comfortably on a plush sofa...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5shlh00010dk4ar9wakhp/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5xhuo000201s67gs4cx11/videoposter.webp"
  },
  {
    title: "A wide shot of a vast, otherworldly desert with a deep blue sky overhead...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5shj300030ejt53a482z2/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5xfsp002x01s666uj3hdq/videoposter.webp"
  },
  {
    title: "A drone shot flies down into the central courtyard of a majestic medieval castle...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5segw00010djs3yr437wr/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5xfhy002w01s63v737zqx/videoposter.webp"
  },
  {
    title: "A cinematic anamorphic shot of a man walking through a dimly lit, foggy graveyard...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5seqy00030dl2f6ga2vkq/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5xeo7002v01s689a13rdk/videoposter.webp"
  },
  {
    title: "A static shot of actress Daisy Ridley, dressed in a sleek, strapless red gown with black detailing...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5s74300010dmb0ott4sjo/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5xc0o002u01s6bvuz7q9r/videoposter.webp"
  },
  {
    title: "A stylish man in a three-piece suit and a gold chain draped across his vest exits a 1940s night club...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5s4lk00010dmf1u78fjw6/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5x9c9002t01s6a93de1d1/videoposter.webp"
  },
  {
    title: "A close-up of a humanoid lemur with a playful face wearing a cyberpunk tactical suit...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5rzyo00010dl264b6dj6x/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5wz6k002r01s62k6fezva/videoposter.webp"
  },
  {
    title: "A static shot of a young blind lady entering a small diner at night...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5rxoi00010cl5bbjq98os/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5wo78002p01s69i8l8uca/videoposter.webp"
  },
  {
    title: "A static shot of a horse's face fills the frame, with the camera focusing on its deep brown eye...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5rhhb00010dmh1uys0873/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5vvio002q01s60oqjaxtv/videoposter.webp"
  },
  {
    title: "A close-up shot of actress Daisy Ridley in a red dress, with black detailing and sheer sleeves...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5r75200010djq65gx128n/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5ui3a002o01s69k9s0b81/videoposter.webp"
  },
  {
    title: "A close-up shot of a steaming cup of coffee on a rustic wooden table...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5r2sd00070clidc6jcpck/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5uekr002p01s69ixa3mv3/videoposter.webp"
  },
  {
    title: "A close-up shot of a smiling child holding a brightly colored spinning top...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5r2bf00010dlb0axd5ahg/reencoded.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5udfe002o01s6h8i82gei/videoposter.webp"
  },
  {
    title: "A close-up shot of an adorable white, fluffy cat dressed in a vibrant, colorful outfit...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5qxt700050cli1iyrcwhq/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5ueks002g01s68qlc3bco/videoposter.webp"
  },
  {
    title: "A static shot of a mystical figure dressed in flowing white robes...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5qwie00030cli7qe7c7dr/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5u79c002s01s614osbaf6/videoposter.webp"
  },
  {
    title: "A close-up shot of a time portal opening up in the modern city...",
    url: "https://cdn.genmo.dev/results/text-to-video-v4/2024-10-23/cm2l5qvl400010cli1sdg8g84/watermarked.mp4",
    thumbnail: "https://cdn.genmo.dev/results/text_to_video/2024-10-23/00/cm2l5u33b002r01s69szldlrv/videoposter.webp"
  }
];

export default videoData;
const videoUrls = [];