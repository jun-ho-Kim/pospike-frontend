import React, { AudioHTMLAttributes, createContext, MutableRefObject, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { Header } from '../components/header';
import { AudioPlayer } from '../components/audioPlayer';
import { SearchPodcast } from '../components/searchPodcast';
import { SearchPodcastForm } from '../components/searchPodcastForm';
import { PopularPodcasts } from '../pages/Listener/popular-podcasts';
import { LOCALSTORAGE_TOKEN } from '../constants';
import { NotFound } from '../pages/404';
import { Categories } from '../pages/categories';
import { Podcast } from '../pages/Detailpodcast';
import { EpisodeList } from '../pages/episodeList';
import Home from '../pages/home';
import { CreateEpisode } from '../pages/Host/create-episode';
import { CreatePodcast } from '../pages/Host/create-podcast';
import { DeletePodcast } from '../pages/Host/delete-podcast';
import { UpdatePodcast } from '../pages/Host/update-podcast';
// import { UpdateEpisode } from '../pages/Host/update-episode';
import { DetailEpisode } from '../pages/episode';
import { EditProfile } from '../pages/edit-profile';
import { Subscriptions } from '../pages/Listener/subscriptions';
import { MyPodcasts } from '../pages/Host/myPodcasts';
import { getEpisode } from '../__generated__/getEpisode';
import { getEpisodeDetail_Query_getEpisodeDetail_episode } from '../__generated__/getEpisodeDetail_Query';
import { useMe } from '../components/hooks/useMe';
import { UserRole } from '../__generated__/globalTypes';
import { Footer } from '../components/footer'

interface IContext {
    isShowing: boolean;
    setIsShowing: React.Dispatch<boolean>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<boolean>;
    audioUrl: string | null;
    setAudioUrl: React.Dispatch<string | null>;
    thumbnail: string | null;
    setThumbnail: React.Dispatch<string | null>;
    podcastTitle: string | null; 
    setPodcastTitle: React.Dispatch<string | null>;
    episode: getEpisodeDetail_Query_getEpisodeDetail_episode | null; 
    setEpisode: any | null;
    audioLength: string | null;
    setAudioLength: React.Dispatch<string | null>;
}

export const PlayerContext = createContext<IContext | null>(null)

const hostRoutes = [
    {path: "/", component: <MyPodcasts />},
    {path: "/create-podcast", component: <CreatePodcast />},
    {path: "/:id/edit-podcast", component: <UpdatePodcast />},
    {path: "/:id/delete-podcast", component: <DeletePodcast />},
    {path: "/:id/create-episode", component: <CreateEpisode />},

    // {path: ":id/episodes/:episodeId/edit", component: <UpdateEpisode />},
];

const listenerRouter = [
    {path: "/", component: <Home />},
    {path: "/search", component: <SearchPodcast />},
    {path: "/subscription", component: <Subscriptions />},
    {path: "/categories", component: <Categories />},
    {path: "/rank", component: <PopularPodcasts />  },
];

const commonRouter = [
    {path: "/edit-profile", component: <EditProfile />},
    {path: "/:id", component: <Podcast />},
    {path: "/:id/episodes/:episodeId", component: <DetailEpisode />},

]






export const LoggedInRouter = () => {
    const history = useHistory();
    const me = useMe();
    const [isShowing, setIsShowing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [episode, setEpisode] = useState<getEpisodeDetail_Query_getEpisodeDetail_episode| null>(null);
    const [podcastTitle, setPodcastTitle] = useState<string | null>("");
    const [thumbnail, setThumbnail] = useState<string | null>("");
    const [audioLength, setAudioLength] = useState<string | null>("");
    const handleOnClick = () => {
        isLoggedInVar(false);
        localStorage.removeItem(LOCALSTORAGE_TOKEN);
        alert("로그아웃 되었습니다.");
        history.push("/");
    }
    return (
        <PlayerContext.Provider
            value={{
                isShowing,
                isPlaying,
                audioUrl,
                episode, 
                podcastTitle,
                thumbnail,
                audioLength,
                setIsShowing,
                setIsPlaying,
                setAudioUrl,
                setEpisode,
                setPodcastTitle,
                setThumbnail,
                setAudioLength,
            }}
        >
        <Router>
            <Header />
            <Switch>
                {me.data?.me.role === UserRole.Host &&
                    hostRoutes.map(route => (
                        <Route exact key={route.path} path={route.path}>
                            {route.component}
                        </Route>
                    ))
                };
                {me.data?.me.role === UserRole.Listener &&
                    listenerRouter.map(route => (
                        <Route exact key={route.path} path={route.path}>
                            {route.component}
                        </Route>
                    ))
                };
                {commonRouter.map(route => (
                    <Route exact key={route.path} path={route.path}>
                        {route.component}
                    </Route>
                ))}
                <Route>
                    <NotFound />
                </Route>
            </Switch>
                <Footer />
            <AudioPlayer />
            
            {/* <div className={'flex items-center justify-center absolute top-0 right-0'}> */}
                {/* <span onClick={handleOnClick}
                className={"bg-blue-100 text-sm"}>
                    로그아웃
                </span> */}
            {/* </div> */}
        </Router>
        </PlayerContext.Provider>
    )
}