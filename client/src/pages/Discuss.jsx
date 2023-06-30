import React, { useEffect, useState } from 'react';
import { Avatar, CircularProgress, Button, Chip, IconButton, InputLabel } from '@mui/material';
import { useFetchAllDoubtsMutation, useFetchTagsMutation } from '../services/appApi';
import { styled, alpha } from '@mui/material/styles';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { useNavigate } from 'react-router-dom';
import InputBase from '@mui/material/InputBase';
import CloseRounded from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import ArrowDropUpSharpIcon from '@mui/icons-material/ArrowDropUpSharp';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import DisplayPostComponent from '../components/DisplayPostComponent';
import '../style/Discuss.css';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  marginLeft: 0,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  background: 'transparent',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Discuss = () => {
  const [doubts, setDoubts] = useState([]);
  const [allDoubts, setAllDoubts] = useState([]);
  const [searchField, setSearchField] = useState('');

  const [criteria, setCriteria] = useState('newest_to_oldest');
  const [openPostDialog, setOpenPostDialog] = useState(false);

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [fetchAllDoubtsFunction] = useFetchAllDoubtsMutation();
  const [fetchTagsFunction] = useFetchTagsMutation();
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchAllDoubtsFunction().then(({ data, error }) => {
      if (data) {
        setDoubts(data);
        setAllDoubts(data);
      } else {
        enqueueSnackbar('Unable to fetch doubts at the moment! Please try again!', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      }
    });

    fetchTagsFunction().then(({ data, error }) => {
      if (data) setTags(data);
      else {
        enqueueSnackbar('Unable to fetch tags at the moment! Please try again!', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      }
      setIsLoading(false);
    });
  }, [fetchAllDoubtsFunction, fetchTagsFunction]);

  useEffect(() => {
    setDoubts(
      allDoubts?.filter(({ doubtDetails }) => selectedTags?.every((tag) => doubtDetails?.tags?.includes(tag)))
    );

    setDoubts((state) =>
      state.filter(
        (doubt) =>
          doubt?.doubtDetails?.doubtTitle?.toLowerCase()?.includes(searchField?.toLowerCase()) ||
          doubt?.ownerInfo?.name?.toLowerCase()?.includes(searchField?.toLowerCase())
      )
    );
  }, [selectedTags, allDoubts, searchField]);

  return (
    <>
      {loading ? (
        <CircularProgress
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            top: '50%',
            left: '50%',
            color: '#1772cd',
          }}
        />
      ) : (
        <div className='discuss-wrapper'>
          <div className='filtering-wrapper'>
            <div className='filter-buttons'>
              <Button
                onClick={() => {
                  setDoubts((state) =>
                    state?.sort(
                      (a, b) =>
                        Date.parse(b?.doubtDetails?.createdAt) - Date.parse(a?.doubtDetails?.createdAt)
                    )
                  );
                  setCriteria('newest_to_oldest');
                }}
                className={`custom_filter_btn ${
                  criteria === 'newest_to_oldest' ? 'custom_filter_btn_active' : ''
                }`}>
                Newest to Oldest
              </Button>
              <Button
                onClick={() => {
                  setDoubts((state) =>
                    state?.sort((a, b) => b?.doubtDetails?.upVotes?.length - a?.doubtDetails?.upVotes?.length)
                  );
                  setCriteria('most_votes');
                }}
                startIcon={<WhatshotRoundedIcon />}
                className={`custom_filter_btn ${
                  criteria === 'most_votes' ? 'custom_filter_btn_active' : ''
                }`}>
                Most Votes
              </Button>

              <Button
                variant='outlined'
                onClick={() => {
                  setCriteria('new_post');
                  setOpenPostDialog(true);
                }}
                className={`custom_filter_btn ${criteria === 'new_post' ? 'custom_filter_btn_active' : ''}`}
                startIcon={<AddRoundedIcon />}>
                New Post
              </Button>
            </div>
            <div className='action-buttons'>
              <div className='search-by-name'>
                <Search className='search-div'>
                  <StyledInputBase
                    placeholder='Search by Title, Tags'
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                  />
                  <IconButton onClick={() => setSearchField('')}>
                    <CloseRounded />
                  </IconButton>
                </Search>
              </div>
            </div>
          </div>
          <div className='doubts-tags-wrapper'>
            {tags?.map((tag) => (
              <Chip
                onClick={() => {
                  if (selectedTags.indexOf(tag) === -1) setSelectedTags((state) => [...state, tag]);
                  else setSelectedTags((state) => state.filter((all) => all !== tag));
                }}
                className={`home-post-tags ${selectedTags.indexOf(tag) !== -1 ? 'active' : ''}`}
                key={tag}
                label={tag}
              />
            ))}
          </div>
          <SnackbarProvider maxSnack={3}></SnackbarProvider>
          {openPostDialog && <DisplayPostComponent />}
          <div className='doubts-wrapper'>
            {doubts?.map(({ doubtDetails, ownerInfo }, idx) => (
              <div key={idx} className='doubt-preview-wrapper'>
                <div className='dynamic-info'>
                  <div className='owner-profile'>
                    <Avatar style={{ width: 50, height: 50 }} src={ownerInfo?.photo} />
                  </div>
                  <div className='doubt-info'>
                    <div className='doubt-title-and-tags-info'>
                      <div onClick={() => navigate(`/doubt?id=${doubtDetails._id}`)} className='doubt-title'>
                        <p>
                          {doubtDetails?.doubtTitle?.split(' ')?.map((word, idx) => {
                            if (idx < 3) return word + ' ';
                            else if (idx === 3) return word + '...';
                            return '';
                          })}
                        </p>
                      </div>
                      <InputLabel className='doubts-tags' style={{ width: '250px', overflowX: 'hidden' }}>
                        {doubtDetails?.tags?.map((tag, idx) => (
                          <Chip
                            key={idx}
                            onClick={() => {
                              if (selectedTags.indexOf(tag) === -1)
                                setSelectedTags((state) => [...state, tag]);
                              else setSelectedTags((state) => state.filter((all) => all !== tag));
                            }}
                            className={`home-post-tags ${selectedTags.indexOf(tag) !== -1 ? 'active' : ''}`}
                            label={tag}
                          />
                        ))}
                      </InputLabel>
                    </div>
                    <div className='doubt-info'>
                      <div className='user-info'>
                        {`${ownerInfo?.name} created at ${new Date(
                          doubtDetails?.createdAt
                        ).toLocaleDateString()} | ${new Date(doubtDetails?.createdAt).getHours()}:${new Date(
                          doubtDetails?.createdAt
                        ).getMinutes()}`}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='static-info'>
                  <div className='info-outer'>
                    <VisibilityRounded />
                    {doubtDetails?.views}
                  </div>
                  <div className='info-outer'>
                    <ArrowDropUpSharpIcon />
                    {doubtDetails?.upVotes?.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Discuss;
