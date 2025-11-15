const NANO_METING = "https://metingapi.nanorocky.top/";
const buildUrl = (query: NanoMeting.SearchParams) => {
  const url = new URL(NANO_METING);
  Object.entries(query).reduce((acc, [k, v]) => {
    acc.append(k, v);
    return acc;
  }, url.searchParams);
  return url;
};

async function search<T extends IMedia.SupportMediaType>(
  query: string,
  page: number,
  type: T,
) {
  return type !== "music"
    ? ({ isEnd: true, data: [] } as IPlugin.ISearchResult<"music">)
    : await fetch(
        buildUrl({
          server: "netease",
          type: "search",
          id: "0",
          keyword: query,
        }),
      )
        .then((i) => i.json())
        .then(
          (i) =>
            ({
              isEnd: true,
              data: (i as NanoMeting.SearchRsp).map((i) => ({
                artist: i.artist,
                title: i.name,
                album: i.album,
                artwork: i.pic,
                url: i.url,
                lrc: i.lrc,
                platform: i.sourse,
                id: new URL(i.url).searchParams.get("id"),
              })),
            }) as IPlugin.ISearchResult<"music">,
        )
        .catch(
          () => ({ isEnd: true, data: [] }) as IPlugin.ISearchResult<"music">,
        );
}
export default {
  platform: "nano-meting",
  author: "Pizero",
  // TODO: update
  // srcUrl: "https://example.catcat.work/xxx.js",
  // primaryKey: ["id", "aid", "bid"],
  cacheControl: "cache",
  version: "0.0.0",
  supportedSearchType: ["music"],
  // TODO: 在这里把插件剩余的功能补充完整
  search,
} as IPlugin.IPluginDefine;
